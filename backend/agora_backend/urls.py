from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.views import PostViewSet
from .auth_views import login_view, get_csrf_token, me_view, debug_cookies_view
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import status
from core.models import Report, Post, Comment

@api_view(['POST'])
@permission_classes([AllowAny])
def report_post_view(request, post_id=None):
    """Create a report for a post. Requires authentication."""
    if not request.user or not getattr(request.user, 'is_authenticated', False):
        return Response({'detail': 'Authentication required'}, status=401)
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'detail': 'Post not found'}, status=404)
    reason = request.data.get('reason', '').strip() or 'No reason provided'
    report = Report.objects.create(user=request.user, content_type='post', object_id=post.id, reason=reason)
    return Response({'id': report.id, 'status': report.status}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def report_comment_view(request, comment_id=None):
    """Create a report for a comment. Requires authentication."""
    if not request.user or not getattr(request.user, 'is_authenticated', False):
        return Response({'detail': 'Authentication required'}, status=401)
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return Response({'detail': 'Comment not found'}, status=404)
    reason = request.data.get('reason', '').strip() or 'No reason provided'
    report = Report.objects.create(user=request.user, content_type='comment', object_id=comment.id, reason=reason)
    return Response({'id': report.id, 'status': report.status}, status=201)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def reports_admin_view(request, report_id=None):
    """List reports (GET) for staff, and allow simple actions (POST) to resolve/dismiss a report.

    POST body: { action: 'resolve'|'dismiss' }
    """
    # Only staff may access admin report listing/actions
    if not request.user or not getattr(request.user, 'is_authenticated', False) or not getattr(request.user, 'is_staff', False):
        return Response({'detail': 'Staff only'}, status=403)

    if request.method == 'GET':
        qs = Report.objects.all().order_by('-created_at')
        results = []
        for r in qs:
            results.append({
                'id': r.id,
                'user': r.user.username,
                'content_type': r.content_type,
                'object_id': r.object_id,
                'reason': r.reason,
                'status': r.status,
                'created_at': r.created_at,
            })
        return Response(results)

    # POST action on a specific report
    if report_id is None:
        return Response({'detail': 'Report id required for actions'}, status=400)
    try:
        r = Report.objects.get(pk=report_id)
    except Report.DoesNotExist:
        return Response({'detail': 'Report not found'}, status=404)
    action = (request.data.get('action') or '').lower()
    if action == 'resolve':
        r.status = 'resolved'
        r.save()
        return Response({'id': r.id, 'status': r.status})
    elif action == 'dismiss':
        r.status = 'dismissed'
        r.save()
        return Response({'id': r.id, 'status': r.status})
    else:
        return Response({'detail': 'Unsupported action'}, status=400)

def redirect_root_to_profile(request):
    return HttpResponseRedirect(reverse('profile'))

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

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
def circles_view(request, circle_id=None):
    """Simple circles API: list circles, join and leave actions.

    Routes wired in urls.py:
      GET  /api/circles/                 -> list circles
      POST /api/circles/<id>/join/       -> join circle (auth required)
      POST /api/circles/<id>/leave/      -> leave circle (auth required)

    Returns minimal JSON that the frontend expects (id, name, description,
    is_member flag and member_count).
    """
    from core.models import Circle, CircleMembership

    # LIST: /api/circles/
    if request.method == 'GET' and circle_id is None:
        circles = Circle.objects.all()
        results = []
        for c in circles:
            member_count = CircleMembership.objects.filter(circle=c).count()
            is_member = False
            if request.user and getattr(request.user, 'is_authenticated', False):
                is_member = CircleMembership.objects.filter(circle=c, user=request.user).exists()
            results.append({
                'id': c.id,
                'name': c.name,
                'description': c.description,
                'member_count': member_count,
                'is_member': is_member,
            })
        return Response(results)

    # JOIN / LEAVE actions require a circle_id
    if circle_id is None:
        return Response({'detail': 'Circle id required'}, status=400)

    # Must be authenticated to change membership
    if not request.user or not request.user.is_authenticated:
        return Response({'detail': 'Authentication required'}, status=401)

    try:
        circle = Circle.objects.get(pk=circle_id)
    except Circle.DoesNotExist:
        return Response({'detail': 'Circle not found'}, status=404)

    # Determine action by inspecting path (join vs leave)
    path = request.path.lower()
    if path.endswith('/join/'):
        obj, created = CircleMembership.objects.get_or_create(user=request.user, circle=circle)
        return Response({'joined': True, 'created': created})
    elif path.endswith('/leave/'):
        deleted = CircleMembership.objects.filter(user=request.user, circle=circle).delete()
        return Response({'left': True, 'deleted_count': deleted[0]})
    else:
        return Response({'detail': 'Unsupported action'}, status=400)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('favicon.ico', favicon_view, name='favicon'),
    path('accounts/', include('django.contrib.auth.urls')),  # Adds login/logout URLs
    path('api/auth/csrf/', get_csrf_token, name='csrf-token'),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/me/', me_view, name='auth-me'),
    path('api/auth/debug-cookies/', debug_cookies_view, name='auth-debug-cookies'),
    path('api/users/<int:user_id>/', users_view, name='user-detail'),
    path('api/circles/', circles_view, name='circles-list'),
    path('api/circles/<int:circle_id>/join/', circles_view, name='circle-join'),
    path('api/circles/<int:circle_id>/leave/', circles_view, name='circle-leave'),
    path('api/posts/<int:post_id>/report/', report_post_view, name='report-post'),
    path('api/comments/<int:comment_id>/report/', report_comment_view, name='report-comment'),
    path('api/reports/', reports_admin_view, name='reports-admin'),
    path('api/reports/<int:report_id>/action/', reports_admin_view, name='report-action'),
    path('api/', include(router.urls)),
    path('', redirect_root_to_profile, name='root'),
    path('', include('core.urls')),  # Your profile and other core routes
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

