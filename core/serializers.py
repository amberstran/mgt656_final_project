from rest_framework import serializers
from .models import Post, Comment, Like


class UserLiteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        return getattr(obj, 'display_name', '') or getattr(obj, 'username', '')


class CommentSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'is_anonymous', 'created_at', 'parent', 'replies']
        read_only_fields = ['id', 'user', 'created_at', 'replies']

    def get_replies(self, obj):
        # Return serialized replies (children) - only top-level comments have replies
        if obj.parent is None:
            replies = obj.replies.all()
            if replies.exists():
                return CommentSerializer(replies, many=True, context=self.context).data
        return []


class PostSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    liked = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'is_anonymous', 'image_url', 'circle', 'created_at', 'likes_count', 'liked', 'comments']

    def get_liked(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()

    def get_comments(self, obj):
        # Only return top-level comments (comments without a parent)
        try:
            top_level_comments = obj.comments.filter(parent=None).order_by('-created_at')
            return CommentSerializer(top_level_comments, many=True, context=self.context).data
        except Exception as e:
            # Fallback to empty list if there's an error
            return []
