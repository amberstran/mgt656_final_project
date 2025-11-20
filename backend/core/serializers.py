from rest_framework import serializers
from .models import Post, Comment


class UserLiteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    display_name = serializers.SerializerMethodField()
    post_with_real_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        # If user prefers real-name posts, show first/last name if available
        try:
            if getattr(obj, 'post_with_real_name', False):
                full = ' '.join(filter(None, [getattr(obj, 'first_name', ''), getattr(obj, 'last_name', '')])).strip()
                if full:
                    return full
        except Exception:
            pass
        return getattr(obj, 'display_name', '') or getattr(obj, 'username', '')

    def get_post_with_real_name(self, obj):
        return bool(getattr(obj, 'post_with_real_name', False))


class CommentSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False, allow_null=True)
    # We expose the post as a read-only field so clients don't have to pass it.
    post = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
    fields = ['id', 'user', 'post', 'content', 'is_anonymous', 'created_at', 'parent', 'replies']
    read_only_fields = ['id', 'user', 'post', 'created_at', 'replies']

    def get_replies(self, obj):
        if obj.parent is None:
            replies = obj.replies.all()
            if replies.exists():
                return CommentSerializer(replies, many=True, context=self.context).data
        return []

    def to_representation(self, instance):
        # Base representation
        data = super().to_representation(instance)
        request = self.context.get('request')
        viewer = getattr(request, 'user', None)
        # Redact author details if the comment is anonymous and viewer is not author/staff
        if instance.is_anonymous:
            is_owner = bool(viewer and viewer.is_authenticated and viewer.id == getattr(instance.user, 'id', None))
            is_staff = bool(viewer and getattr(viewer, 'is_staff', False))
            if not (is_owner or is_staff):
                data['user'] = {
                    'id': None,
                    'username': 'Anonymous',
                    'display_name': 'Anonymous',
                }
        return data


class PostSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    liked = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'is_anonymous', 'image_url', 'image', 'circle', 'created_at', 'likes_count', 'liked', 'comments']

    def get_liked(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()

    def get_comments(self, obj):
        try:
            top_level_comments = obj.comments.filter(parent=None).order_by('-created_at')
            return CommentSerializer(top_level_comments, many=True, context=self.context).data
        except Exception:
            return []

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        viewer = getattr(request, 'user', None)
        if instance.is_anonymous:
            is_owner = bool(viewer and viewer.is_authenticated and viewer.id == getattr(instance.user, 'id', None))
            is_staff = bool(viewer and getattr(viewer, 'is_staff', False))
            if not (is_owner or is_staff):
                data['user'] = {
                    'id': None,
                    'username': 'Anonymous',
                    'display_name': 'Anonymous',
                }
        return data
