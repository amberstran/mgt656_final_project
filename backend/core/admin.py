from django.contrib import admin
from .models import Circle, CircleMembership


@admin.register(Circle)
class CircleAdmin(admin.ModelAdmin):
	list_display = ('id', 'name')
	search_fields = ('name',)


@admin.register(CircleMembership)
class CircleMembershipAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'circle', 'joined_at')
	list_filter = ('circle',)
	search_fields = ('user__username', 'circle__name')
