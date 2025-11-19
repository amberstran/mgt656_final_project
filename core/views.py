# core/views.py - Merged: Personal profile + Posts API
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Count

from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer

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
        feed = self.request.query_params.get('feed', None)
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
        data['post'] = post.id
        data['user'] = user.id
        serializer = CommentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        if instance.user != user and not user.is_staff:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=403)
        return super().destroy(request, *args, **kwargs)
