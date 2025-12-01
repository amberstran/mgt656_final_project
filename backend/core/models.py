# core/models.py
from django.db import models
from django.conf import settings
import bleach
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """Custom user model for Agora"""
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True)
    program = models.CharField(max_length=100, blank=True, verbose_name="Major/Program")
    grade = models.CharField(max_length=20, blank=True, verbose_name="Grade/Year")
    
    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'
    
    def save(self, *args, **kwargs):
        # Sanitize user-provided bio to strip any potentially harmful HTML.
        # We intentionally keep the whitelist empty to avoid rendering raw HTML.
        if self.bio:
            # strip all tags, leaving only plain text
            self.bio = bleach.clean(self.bio, tags=[], attributes={}, strip=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class Circle(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CircleMembership(models.Model):
    user = models.ForeignKey('core.CustomUser', on_delete=models.CASCADE, related_name='circle_memberships')
    circle = models.ForeignKey('core.Circle', on_delete=models.CASCADE, related_name='memberships')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'circle')

    def __str__(self):
        return f"{self.user.username} -> {self.circle.name}"


# === Social models (ported from teammates' app) ===

class Circle(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_anonymous = models.BooleanField(default=True)
    # Optional remote image URL (legacy)
    image_url = models.URLField(blank=True, null=True)
    # Optional uploaded image (served from MEDIA_ROOT)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    circle = models.ForeignKey(Circle, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {'Anonymous' if self.is_anonymous else self.user}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    is_anonymous = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def __str__(self):
        return f"Comment by {'Anonymous' if self.is_anonymous else self.user}"


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")

    class Meta:
        unique_together = ("user", "post")

    def __str__(self):
        return f"{self.user} likes {self.post}"

