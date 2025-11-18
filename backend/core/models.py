# core/models.py
from django.db import models
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
