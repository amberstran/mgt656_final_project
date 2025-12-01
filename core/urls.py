# core/urls.py - Merged: Personal profile routes + API routes
from django.urls import path
from . import views, api_views

urlpatterns = [
    # Profile routes
    path('profile/', views.profile_view, name='profile'),
    path('canvas/', views.canvas_verify_view, name='canvas_verify'),
    
    # API routes
    path('posts/', api_views.PostListAPIView.as_view(), name='post-list'),
    path('posts/<int:pk>/', api_views.PostDetailAPIView.as_view(), name='post-detail'),
    
    # Circle membership approval
    path('circles/membership/<int:member_id>/approve/', views.approve_membership, name='membership-approve'),
]

