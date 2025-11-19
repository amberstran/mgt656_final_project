# core/urls.py - Merged: Personal profile routes + API routes
from django.urls import path
from . import views, api_views

urlpatterns = [
    # Profile routes
    path('profile/', views.profile_view, name='profile'),
    path('canvas/', views.canvas_verify_view, name='canvas_verify'),
    
    # API routes (if needed in addition to router in main urls.py)
    # Note: Post API is already handled by router in backend/agora_backend/urls.py
]
