from rest_framework import serializers
from .models import Post, Comment, Like


class UserLiteSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    display_name = serializers.CharField()


class CommentSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'is_anonymous', 'created_at', 'parent', 'replies']

    def get_replies(self, obj):
        # Return serialized replies (children)
        return CommentSerializer(obj.replies.all(), many=True, context=self.context).data


class PostSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'is_anonymous', 'image_url', 'circle', 'created_at', 'likes_count', 'liked', 'comments']

    def get_liked(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()
