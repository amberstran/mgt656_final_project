from rest_framework import generics, pagination
from rest_framework.response import Response
from django.utils import timezone
from .models import Post
from .serializers import PostSerializer


class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PostListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Post.objects.select_related('user').order_by('-created_at')
        # support feed param: 'new' -> newest first, 'all' -> default ordering
        feed = self.request.query_params.get('feed')
        if feed == 'new':
            return queryset
        if feed == 'top':
            # placeholder: top posts could be by number of likes — implement simple fallback
            return queryset
        return queryset


class PostDetailAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.select_related('user')
    serializer_class = PostSerializer
