"""Django admin registrations for core app.

Registers the custom user model plus content models so they appear
in the admin interface. Adds small quality-of-life list displays
and filters for moderation tasks (reports, posts, comments).
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
	CustomUser,
	Circle,
	CircleMembership,
	Post,
	Comment,
	Like,
	Message,
	Report,
)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
	model = CustomUser
	list_display = (
		'id', 'username', 'email', 'is_active', 'is_staff',
		'program', 'grade', 'post_with_real_name'
	)
	list_filter = ('is_active', 'is_staff', 'post_with_real_name', 'program', 'grade')
	search_fields = ('username', 'email', 'program', 'grade')
	ordering = ('username',)
	fieldsets = UserAdmin.fieldsets + (
		('Agora Profile', {
			'fields': ('bio', 'avatar', 'program', 'grade', 'post_with_real_name')
		}),
	)


@admin.register(Circle)
class CircleAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'description')
	search_fields = ('name',)


@admin.register(CircleMembership)
class CircleMembershipAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'circle', 'joined_at')
	list_filter = ('circle',)
	search_fields = ('user__username', 'circle__name')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	list_display = ('id', 'title', 'user', 'is_anonymous', 'circle', 'created_at')
	list_filter = ('is_anonymous', 'circle')
	search_fields = ('title', 'content', 'user__username')
	readonly_fields = ('created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
	list_display = ('id', 'post', 'user', 'is_anonymous', 'created_at', 'parent')
	list_filter = ('is_anonymous', 'post')
	search_fields = ('content', 'user__username')
	readonly_fields = ('created_at',)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'post')
	search_fields = ('user__username', 'post__title')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
	list_display = ('id', 'circle', 'user', 'is_anonymous', 'timestamp')
	list_filter = ('circle', 'is_anonymous')
	search_fields = ('content', 'user__username')
	readonly_fields = ('timestamp',)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'content_type', 'object_id', 'status', 'created_at')
	list_filter = ('content_type', 'status')
	search_fields = ('reason', 'user__username')
	readonly_fields = ('created_at',)
	actions = ['mark_resolved', 'mark_dismissed']

	def mark_resolved(self, request, queryset):
		updated = queryset.update(status='resolved')
		self.message_user(request, f"Marked {updated} report(s) resolved.")
	mark_resolved.short_description = 'Mark selected reports resolved'

	def mark_dismissed(self, request, queryset):
		updated = queryset.update(status='dismissed')
		self.message_user(request, f"Dismissed {updated} report(s).")
	mark_dismissed.short_description = 'Dismiss selected reports'

