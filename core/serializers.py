from rest_framework import serializers
from .models import Post


class UserBriefSerializer(serializers.Serializer):
    display_name = serializers.CharField()


class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'is_anonymous', 'created_at']

    def get_user(self, obj):
        user = obj.user
        return {'display_name': getattr(user, 'display_name', user.username if user else None)}
