# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile_view, name='profile'),
    path('canvas/', views.canvas_verify_view, name='canvas_verify'),
]
