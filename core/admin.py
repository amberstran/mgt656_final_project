from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Post, Comment, Like, Circle, CircleMembership, Message, Report

admin.site.register(CustomUser, UserAdmin)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Circle)
admin.site.register(CircleMembership)
admin.site.register(Message)
admin.site.register(Report)
