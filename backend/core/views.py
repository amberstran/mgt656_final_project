from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required  # retained for future gated views (not used for public profile now)
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.db import IntegrityError
from django.db.models import Count

# DRF imports for Posts API
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer

"""Profile-focused views only.

Registration & email verification functionality has been removed per project
direction. This module now provides:
 - profile_view: HTML profile page
 - profile_api_view: JSON stats endpoint (placeholder data until posts/comments added)

Future work will replace mock stats with real counts and extend user fields.
"""

User = get_user_model()

# ============================================================================
# CONSTANTS
# ============================================================================

LEVELS = [
    {"name": "Ember",  "min": 0,  "max": 19,  "hint": "A faint ember — your journey just begins."},
    {"name": "Spark",  "min": 20, "max": 39,  "hint": "You're lighting up the space with ideas."},
    {"name": "Flame",  "min": 40, "max": 69,  "hint": "Your energy is felt across the community."},
    {"name": "Blaze",  "min": 70, "max": 94,  "hint": "You're a blazing fire — driving discussions."},
    {"name": "Aurora", "min": 95, "max": 999, "hint": "A rare light that inspires others."},
]

def _calc_level(score: int):
        """Calculate user level based on score."""
        for r in LEVELS:
                if r["min"] <= score <= r["max"]:
                        return r
        return LEVELS[0]

# ============================================================================
# VIEWS: PROFILE
# ============================================================================

def profile_view(request):
    """Render the user profile page"""
    # Mock statistics (will be replaced with real data once posts/comments features are ready)
    stats = {
        "posts": 3,
        "comments": 4,
        "likes": 10,
    }
    
    # Calculate Agora Sparks score
    score = stats["posts"] * 5 + stats["comments"] * 2 + stats["likes"]
    level = _calc_level(score)
    
    # Add score and level to stats
    stats.update({
        "score": score, 
        "level_name": level["name"], 
        "level_hint": level["hint"]
    })
    
    return render(request, "profile.html", {"stats": stats})


@login_required
def my_posts_view(request):
    posts = Post.objects.filter(user=request.user).order_by('-created_at')
    return render(request, "my_posts.html", {"posts": posts})


@login_required
def my_comments_view(request):
    comments = Comment.objects.filter(user=request.user).order_by('-created_at')
    return render(request, "my_comments.html", {"comments": comments})


def profile_api_view(request):
    """API endpoint for profile data (JSON)"""
    # Mock statistics (can be replaced with real data from database)
    stats = {
        "posts": 3,
        "comments": 4,
        "likes": 10,
    }
    
    # Calculate Agora Sparks score
    score = stats["posts"] * 5 + stats["comments"] * 2 + stats["likes"]
    level = _calc_level(score)
    
    # Add score and level to stats
    stats.update({
        "score": score, 
        "level_name": level["name"], 
        "level_hint": level["hint"]
    })
    
    return JsonResponse({"stats": stats})

# ============================================================================
# VIEWS: REGISTRATION & EMAIL VERIFICATION
# ============================================================================

def _send_verification_email(user, email):
    """Send verification email with link to set password"""
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    verification_link = f"{settings.SITE_URL}/verify/{uid}/{token}/"
    
    subject = "Verify Your Agora Account & Set Password"
    message = f"""
Hello {user.username},

Thank you for registering with Agora! 

Please click the link below to verify your email and set your password:

{verification_link}

This link will expire in 24 hours.

Best regards,
Agora Team
"""
    
    html_message = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to Agora!</h2>
      
      <p>Hello <strong>{user.username}</strong>,</p>
      
      <p>Thank you for registering. Please verify your Yale email and set your password:</p>
      
      <a href="{verification_link}" style="display: inline-block; padding: 12px 24px; background-color: #007aff; 
      color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
        Verify Email & Set Password
      </a>
      
      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        Or copy and paste this link:<br>
        <code>{verification_link}</code>
      </p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        This link expires in 24 hours.
      </p>
    </div>
  </body>
</html>
"""
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def register_view(request):
    """Registration view - Yale email only, collects major & grade"""
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        program = request.POST.get('program', '').strip()
        grade = request.POST.get('grade', '').strip()

        errors = []
        if not username:
            errors.append('Username is required')
        if not email:
            errors.append('Email is required')
        elif not email.endswith('@yale.edu'):
            errors.append('You must register with a Yale email address (@yale.edu)')
        if not program:
            errors.append('Major/Program is required')
        if not grade:
            errors.append('Grade/Year is required')

        if errors:
            return render(request, 'register.html', {
                'errors': errors,
                'username': username,
                'email': email,
                'program': program,
                'grade': grade,
            })

        # Create inactive user (no password yet)
        try:
            user = User.objects.create_user(
                username=username, 
                email=email,
                password=None  # No password until verification
            )
            user.program = program
            user.grade = grade
            user.is_active = False  # Inactive until verified
            user.save()
        except IntegrityError:
            return render(request, 'register.html', {
                'errors': ['Username or email already in use'],
                'username': username,
                'email': email,
                'program': program,
                'grade': grade,
            })

        # Send verification email
        email_sent = _send_verification_email(user, email)
        
        if email_sent:
            return render(request, 'register.html', {
                'success': 'Registration successful! Check your Yale email to verify and set your password.',
                'email': email,
            })
        else:
            return render(request, 'register.html', {
                'success': 'Account created, but email failed to send. Please contact support.',
                'email': email,
            })

    return render(request, 'register.html')


def verify_email_view(request, uidb64, token):
    """Email verification - allows user to set password"""
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    
    if user is None or not default_token_generator.check_token(user, token):
        return render(request, 'verify_email.html', {
            'error': 'Invalid or expired verification link',
        })
    
    if request.method == 'POST':
        password = request.POST.get('password', '')
        password2 = request.POST.get('password2', '')
        
        if not password:
            return render(request, 'verify_email.html', {
                'error': 'Password is required',
                'user': user,
            })
        
        if password != password2:
            return render(request, 'verify_email.html', {
                'error': 'Passwords do not match',
                'user': user,
            })
        
        # Set password and activate user
        user.set_password(password)
        user.is_active = True
        user.save()
        
        # Auto-login
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        
        return render(request, 'verify_email.html', {
            'success': True,
            'user': user,
        })
    
    return render(request, 'verify_email.html', {'user': user})


# =============================
# Posts API (for React frontend)
# =============================

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at').annotate(likes_count=Count('likes'))
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at').annotate(likes_count=Count('likes'))
        _feed = self.request.query_params.get('feed')
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
        if not self.request.user.is_authenticated:
            raise PermissionError('Authentication required')
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        if instance.user != user and not user.is_staff:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=403)
        return super().destroy(request, *args, **kwargs)


# Registration & email verification views removed.
# (register_view, email_verification_view, email_verification_confirm_view, email_verification_api_view)
