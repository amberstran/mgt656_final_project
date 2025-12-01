from django.urls import path
from . import api_views, views

urlpatterns = [
    path('posts/', api_views.PostListAPIView.as_view(), name='post-list'),
    path('posts/<int:pk>/', api_views.PostDetailAPIView.as_view(), name='post-detail'),
    
    # Circle membership approval
    path('circles/membership/<int:member_id>/approve/', views.approve_membership, name='membership-approve'),
]
