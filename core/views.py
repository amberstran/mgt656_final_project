from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import Count
from django.shortcuts import get_object_or_404

from .models import Post, Like, Comment, Circle, CircleMembership
from .serializers import PostSerializer, CommentSerializer, CircleSerializer


def is_circle_admin_or_creator(user, circle):
    """Checks if the user has admin or creator role in the given circle."""
    try:
        membership = CircleMembership.objects.get(circle=circle, user=user)
        return membership.role in ['admin', 'creator']
    except CircleMembership.DoesNotExist:
        return False


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at').annotate(likes_count=Count('likes'))
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Optionally restricts the returned posts by filtering against
        a `feed` query parameter in the URL.
        """
        queryset = Post.objects.all().order_by('-created_at').annotate(likes_count=Count('likes'))
        feed = self.request.query_params.get('feed', None)
        # The feed parameter is accepted but doesn't change the query for now
        # 'new', 'all', and 'top' all return the same ordered list
        # This can be extended later to filter by different criteria
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
            # toggle off
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
        data['post'] = post.id
        data['user'] = user.id
        serializer = CommentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def perform_create(self, serializer):
        # set the posting user from the request
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # allow delete only if the requesting user is the owner or staff
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
        return Circle.objects.all().order_by('name').annotate(member_count=Count('circlemembership'))

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
