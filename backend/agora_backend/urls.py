from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.views import PostViewSet, CircleViewSet
from .auth_views import (
    login_view, 
    get_csrf_token, 
    logout_view, 
    register_view, 
    me_view, 
    debug_cookies_view, 
    health_view
)

# Simple redirect function for root path
def redirect_root_to_profile(request):
    return HttpResponseRedirect('/profile/')

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'circles', CircleViewSet, basename='circle')

# Handle favicon requests (browsers automatically request this)
@api_view(['GET'])
@permission_classes([AllowAny])
def favicon_view(request):
    return HttpResponse(status=204)  # No Content

# Placeholder endpoints for missing routes
@api_view(['GET'])
@permission_classes([AllowAny])
def users_view(request, user_id=None):
    return Response({'detail': 'User endpoint not implemented'}, status=404)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def circles_view(request):
    return Response({'detail': 'Circles endpoint not implemented'}, status=404)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('favicon.ico', favicon_view, name='favicon'),
    path('accounts/', include('django.contrib.auth.urls')),  # Adds login/logout URLs
    path('api/auth/csrf/', get_csrf_token, name='csrf-token'),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/auth/register/', register_view, name='register'),
    path('api/auth/me/', me_view, name='auth-me'),
    path('api/auth/debug-cookies/', debug_cookies_view, name='auth-debug-cookies'),
    path('api/auth/health/', health_view, name='auth-health'),
    path('api/users/<int:user_id>/', users_view, name='user-detail'),
    path('api/circles/', circles_view, name='circles-list'),
    path('api/circles/<int:circle_id>/join/', circles_view, name='circle-join'),
    path('api/circles/<int:circle_id>/leave/', circles_view, name='circle-leave'),
    path('api/', include(router.urls)),
    path('', redirect_root_to_profile, name='root'),
    path('', include('backend.core.urls')),  # Your profile and other core routes
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

