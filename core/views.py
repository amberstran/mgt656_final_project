# core/views.py - Merged: Personal profile + Posts API
import logging
import traceback

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.http import HttpResponseRedirect
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import CircleMembership, Like, Post
from .serializers import CommentSerializer, PostSerializer

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
    return render(request, "profile.html", {"stats": stats})

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
