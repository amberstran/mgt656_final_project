from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile_view, name='profile'),
    path('api/profile/', views.profile_api_view, name='api_profile'),
    path('register/', views.register_view, name='register'),
    path('verify/<uidb64>/<token>/', views.verify_email_view, name='verify_email'),
]
