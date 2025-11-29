from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """Get CSRF token for the frontend"""
    token = get_token(request)
    return Response({'csrfToken': token})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Get CSRF token after login
        token = get_token(request)
        return Response({
            'detail': 'Login successful', 
            'user': {'id': user.id, 'username': user.username},
            'csrfToken': token
        })
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Create a new user account.

    Request JSON:
      { "username": str, "password": str, "bio"?: str, "avatar"?: str,
        "program"?: str, "grade"?: str }

    Returns 201 with basic user info on success.
    """
    User = get_user_model()
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already taken'}, status=409)

    # Optional profile fields
    fields = {}
    for key in ['bio', 'avatar', 'program', 'grade']:
        val = request.data.get(key)
        if isinstance(val, str):
            fields[key] = val.strip()

    user = User.objects.create_user(username=username, password=password, **fields)
    # Optionally auto-login new user for smoother UX
    login(request, user)
    token = get_token(request)
    return Response({
        'detail': 'Registration successful',
        'user': {'id': user.id, 'username': user.username},
        'csrfToken': token,
    }, status=201)


@api_view(['GET'])
def me_view(request):
    """Return basic information about the currently authenticated user.

    Useful for debugging session/CSRF issues from the frontend.
    Response shape:
      { "authenticated": bool, "user": {id, username} | null }
    """
    user = getattr(request, 'user', None)
    if user and getattr(user, 'is_authenticated', False):
        return Response({
            'authenticated': True,
            'user': {'id': user.id, 'username': user.username}
        })
    return Response({'authenticated': False, 'user': None})


@api_view(['GET'])
def debug_cookies_view(request):
    """Return raw cookies and auth status for debugging.

    DO NOT enable in production without restriction; useful for local dev.
    """
    user = getattr(request, 'user', None)
    return Response({
        'authenticated': bool(user and getattr(user, 'is_authenticated', False)),
        'cookie_keys': list(request.COOKIES.keys()),
        'cookies': {k: ('<hidden>' if k.lower() == 'sessionid' else v) for k, v in request.COOKIES.items()},
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def health_view(request):
    """Health endpoint to verify env + cookie flags in production.

    Returns key settings related to cross-origin auth and CSRF, and whether
    the request is secure. Does not expose secrets.
    """
    return Response({
        'debug': settings.DEBUG,
        'allowed_hosts': settings.ALLOWED_HOSTS,
        'cors_allowed_origins': getattr(settings, 'CORS_ALLOWED_ORIGINS', []),
        'csrf_trusted_origins': getattr(settings, 'CSRF_TRUSTED_ORIGINS', []),
        'session_cookie_samesite': getattr(settings, 'SESSION_COOKIE_SAMESITE', None),
        'session_cookie_secure': getattr(settings, 'SESSION_COOKIE_SECURE', None),
        'csrf_cookie_samesite': getattr(settings, 'CSRF_COOKIE_SAMESITE', None),
        'csrf_cookie_secure': getattr(settings, 'CSRF_COOKIE_SECURE', None),
        'request_secure': request.is_secure(),
    })

