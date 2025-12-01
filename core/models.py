# core/models.py
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

# Optional: Custom user if you need extra fields
class CustomUser(AbstractUser):
    netid = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100, blank=True)
    school = models.CharField(max_length=100, blank=True)
    year = models.CharField(max_length=10, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name or self.username


class Circle(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_circles', null=True, blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='CircleMembership', related_name='joined_circles')

    def __str__(self):
        return self.name


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_anonymous = models.BooleanField(default=True)
    image_url = models.URLField(blank=True, null=True)
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


class CircleMembership(models.Model):
    """
    Intermediate model to manage user roles and status within a specific Circle.
    """
    MEMBER_ROLES = (
        ('creator', 'Creator'),       # Can delete circle, assign admins
        ('admin', 'Admin'),           # Can approve members, manage content
        ('member', 'Member'),         # Can post content
        ('pending', 'Pending Approval'), # User applied to join private circle
    )

    circle = models.ForeignKey(Circle, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='circle_memberships')
    role = models.CharField(max_length=20, choices=MEMBER_ROLES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('circle', 'user')

    def __str__(self):
        return f"{self.user.username} as {self.get_role_display()} in {self.circle.name}"


class Message(models.Model):
    circle = models.ForeignKey(Circle, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    is_anonymous = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message in {self.circle} by {'Anonymous' if self.is_anonymous else self.user}"


class Report(models.Model):
    CONTENT_CHOICES = [
        ("post", "Post"),
        ("comment", "Comment"),
        ("message", "Message"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("resolved", "Resolved"),
        ("dismissed", "Dismissed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20, choices=CONTENT_CHOICES)
    object_id = models.PositiveIntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.user} on {self.content_type} {self.object_id}"
