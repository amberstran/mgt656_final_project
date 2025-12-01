# core/views.py - Merged: Personal profile + Posts API
from django.shortcuts import render, get_object_or_404
import logging, traceback
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import Count

from .models import Post, Like, Comment, Circle, CircleMembership
from django.db.models import Q
from .serializers import PostSerializer, CommentSerializer, CircleSerializer


def is_circle_admin_or_creator(user, circle):
    """Checks if the user has admin or creator role in the given circle."""
    try:
        membership = CircleMembership.objects.get(circle=circle, user=user)
        return membership.role in ['admin', 'creator']
    except CircleMembership.DoesNotExist:
        return False


# Personal Profile Feature
LEVELS = [
    {"name": "Ember",  "min": 0,  "max": 19,  "hint": "A faint ember — your journey just begins."},
    {"name": "Spark",  "min": 20, "max": 39,  "hint": "You're lighting up the space with ideas."},
    {"name": "Flame",  "min": 40, "max": 69,  "hint": "Your energy is felt across the community."},
    {"name": "Blaze",  "min": 70, "max": 94,  "hint": "You're a blazing fire — driving discussions."},
    {"name": "Aurora", "min": 95, "max": 999, "hint": "A rare light that inspires others."},
]

def _calc_level(score: int):
    for r in LEVELS:
        if r["min"] <= score <= r["max"]:
            return r
    return LEVELS[0]

@login_required
def profile_view(request):
    stats = {
        "posts": 3,
        "comments": 4,
        "likes": 10,
    }
    score = stats["posts"] * 5 + stats["comments"] * 2 + stats["likes"]
    level = _calc_level(score)
    stats.update({"score": score, "level_name": level["name"], "level_hint": level["hint"]})
    
    # Get user's circles if authenticated
    user_circles = []
    all_circles = Circle.objects.all().annotate(member_count=Count('memberships'))
    if request.user.is_authenticated:
        user_memberships = CircleMembership.objects.filter(user=request.user).select_related('circle')
        user_circles = [
            {
                'circle': m.circle,
                'role': m.get_role_display(),
                'role_code': m.role,
                'member_count': Circle.objects.filter(id=m.circle.id).annotate(cnt=Count('memberships')).first().cnt if Circle.objects.filter(id=m.circle.id).exists() else 0
            }
            for m in user_memberships
        ]
    
    return render(request, "profile.html", {
        "stats": stats,
        "user_circles": user_circles,
        "all_circles": all_circles
    })


@login_required
def canvas_verify_view(request):
    canvas_url = getattr(settings, "CANVAS_EXTERNAL_URL", "https://yale.instructure.com/")
    return HttpResponseRedirect(canvas_url)


# Posts API Feature (from teammates)
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at').annotate(likes_count=Count('likes'))
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at').annotate(likes_count=Count('likes'))

        # Circle-specific filter (frontend may pass ?circle=<id>)
        circle_id = self.request.query_params.get('circle', None)
        user = getattr(self.request, 'user', None)

        if circle_id:
            # If a circle is requested, only return posts in that circle.
            # Enforce membership: only members (or staff) can view circle posts.
            try:
                cid = int(circle_id)
            except (TypeError, ValueError):
                return queryset.none()
            # quick membership check
            if user and getattr(user, 'is_authenticated', False):
                is_member = CircleMembership.objects.filter(user=user, circle_id=cid).exists()
                if user.is_staff or is_member:
                    return queryset.filter(circle__id=cid)
                else:
                    return queryset.none()
            # anonymous users cannot view circle posts
            return queryset.none()

        # No circle specified: enforce membership visibility
        # - Authenticated users: show posts with no circle OR posts in circles they belong to
        # - Anonymous users: only show posts with no circle
        if user and getattr(user, 'is_authenticated', False):
            member_circle_ids = CircleMembership.objects.filter(user=user).values_list('circle_id', flat=True)
            queryset = queryset.filter(Q(circle__isnull=True) | Q(circle__in=member_circle_ids))
        else:
            queryset = queryset.filter(circle__isnull=True)

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if not user or not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        like, created = Like.objects.get_or_create(user=user, post=post)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True

        likes_count = post.likes.count()
        return Response({'liked': liked, 'likes_count': likes_count})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def comment(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if not user or not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data.copy()
        # Default anonymity: if user prefers real-name posts (post_with_real_name=True) then anonymous=False
        if 'is_anonymous' not in data:
            data['is_anonymous'] = not bool(getattr(user, 'post_with_real_name', False))
        serializer = CommentSerializer(data=data, context={'request': request})
        try:
            if serializer.is_valid():
                serializer.save(user=user, post=post)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as exc:
            logging.error("Comment creation failed: %s", exc)
            logging.error(traceback.format_exc())
            return Response({
                'detail': 'Server error creating comment',
                'exception': str(exc),
                'trace': traceback.format_exc().splitlines()[-5:]
            }, status=500)

    def perform_create(self, serializer):
        # Enforce circle membership: if the incoming data includes a circle id,
        # ensure the requesting user is a member of that circle (or staff).
        user = self.request.user
        circle = None
        # serializer.validated_data is available because DRF validates before calling perform_create
        if hasattr(serializer, 'validated_data') and serializer.validated_data:
            circle = serializer.validated_data.get('circle')

        # Save if no circle or membership is valid
        if circle is None:
            serializer.save(user=user)
            return

        # circle is an instance; check membership
        from .models import CircleMembership
        if user.is_staff or CircleMembership.objects.filter(user=user, circle=circle).exists():
            serializer.save(user=user)
            return

        # Not a member => forbid
        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied('You must join the circle before posting to it')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        if instance.user != user and not user.is_staff:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=403)
        return super().destroy(request, *args, **kwargs)


class CircleViewSet(viewsets.ModelViewSet):
    queryset = Circle.objects.all().order_by('name')
    serializer_class = CircleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Circle.objects.all().order_by('name').annotate(member_count=Count('memberships'))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """API endpoint for a user to request or directly join a circle."""
        user = request.user
        circle = self.get_object()

        # 1. Check if user is already a member or pending
        if CircleMembership.objects.filter(circle=circle, user=user).exists():
            return Response(
                {"detail": "You are already a member or your request is pending."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Determine role based on privacy setting
        if circle.is_private:
            # Private circle: Role is 'pending'
            initial_role = 'pending'
            message = f"Request to join '{circle.name}' sent. Waiting for admin approval."
            http_status = status.HTTP_202_ACCEPTED
        else:
            # Public circle: Role is 'member'
            initial_role = 'member'
            message = f"Successfully joined '{circle.name}'."
            http_status = status.HTTP_201_CREATED

        # 3. Create Membership record
        CircleMembership.objects.create(
            circle=circle,
            user=user,
            role=initial_role
        )

        return Response({"message": message}, status=http_status)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        """Leave a circle (removes membership)."""
        circle = self.get_object()
        deleted, _ = CircleMembership.objects.filter(user=request.user, circle=circle).delete()
        if deleted:
            return Response({'message': f"Left '{circle.name}' successfully."})
        return Response({'detail': 'You are not a member of this circle.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_membership(request, member_id):
    """API endpoint for an admin/creator to approve a pending membership request."""
    
    membership = get_object_or_404(CircleMembership, pk=member_id)
    circle = membership.circle
    current_user = request.user
    
    # 1. Permission Check: Ensure current_user is an admin or creator
    if not is_circle_admin_or_creator(current_user, circle):
        return Response(
            {"detail": "You do not have administrative privileges for this circle."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # 2. Status Check & Approval Logic
    if membership.role == 'pending':
        membership.role = 'member'
        membership.save()
        return Response(
            {"message": f"Approved user {membership.user.username} for {circle.name}."}, 
            status=status.HTTP_200_OK
        )
    
    # If the role is already 'member', 'admin', or 'creator'
    return Response(
        {"detail": "Membership is already active or does not require approval."}, 
        status=status.HTTP_400_BAD_REQUEST
    )


# A/B Test Endpoint for team milky-hill
# SHA1(milky-hill) = 1317ccaf707191816834ef3fc0bf040e87ef6d0a
# Endpoint: /1317cca
def abtest_view(request):
    """
    A/B test endpoint that displays team member nicknames and an alternating button.
    Publicly accessible - no login required.
    """
    team_nicknames = [
        "amberstran",      # Amber Tran
        "AmeeshaMasand",   # Ameesha Masand
        "toxiclee",        # Yiru Li
    ]
    
    # Determine variant based on session or random
    # Using session to maintain consistency per user
    if 'abtest_variant' not in request.session:
        import random
        request.session['abtest_variant'] = random.choice(['A', 'B'])
    
    variant = request.session['abtest_variant']
    button_text = "kudos" if variant == 'A' else "thanks"
    
    context = {
        'team_nicknames': team_nicknames,
        'button_text': button_text,
        'variant': variant,
    }
    
    return render(request, 'abtest.html', context)
