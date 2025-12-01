from rest_framework import serializers
from .models import Post, Comment, Like, Circle, CircleMembership


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
    # Expose post as read-only so client doesn't need to send it.
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


class CircleSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True)
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    is_private = serializers.BooleanField(read_only=True)

    class Meta:
        model = Circle
        fields = ['id', 'name', 'description', 'is_private', 'member_count', 'is_member', 'user_role']

    def get_is_member(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        membership = CircleMembership.objects.filter(user=request.user, circle=obj).first()
        return membership is not None and membership.role != 'pending'

    def get_user_role(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return None
        membership = CircleMembership.objects.filter(user=request.user, circle=obj).first()
        return membership.role if membership else None
