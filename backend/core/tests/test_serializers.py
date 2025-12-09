"""
Unit tests for serializers - Testing critical business logic
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from core.models import Post, Comment, Circle
from core.serializers import PostSerializer, CommentSerializer, UserLiteSerializer

User = get_user_model()


class UserLiteSerializerTest(TestCase):
    """Test UserLiteSerializer functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@yale.edu',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
    
    def test_serializer_includes_username(self):
        """Test that serializer includes username"""
        serializer = UserLiteSerializer(self.user)
        self.assertEqual(serializer.data['username'], 'testuser')
    
    def test_display_name_uses_real_name_when_enabled(self):
        """Test that display_name shows real name when post_with_real_name is True"""
        self.user.post_with_real_name = True
        self.user.save()
        
        serializer = UserLiteSerializer(self.user)
        self.assertEqual(serializer.data['display_name'], 'John Doe')
        self.assertTrue(serializer.data['post_with_real_name'])
    
    def test_display_name_uses_username_when_disabled(self):
        """Test that display_name uses username when post_with_real_name is False"""
        self.user.post_with_real_name = False
        self.user.display_name = ''
        self.user.save()
        
        serializer = UserLiteSerializer(self.user)
        self.assertEqual(serializer.data['display_name'], 'testuser')
        self.assertFalse(serializer.data['post_with_real_name'])
    
    def test_display_name_falls_back_to_username(self):
        """Test that display_name falls back to username if names are empty"""
        self.user.post_with_real_name = True
        self.user.first_name = ''
        self.user.last_name = ''
        self.user.display_name = ''
        self.user.save()
        
        serializer = UserLiteSerializer(self.user)
        self.assertEqual(serializer.data['display_name'], 'testuser')


class PostSerializerTest(TestCase):
    """Test PostSerializer functionality"""
    
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='postuser',
            email='post@yale.edu',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@yale.edu',
            password='testpass123'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            content='Test content',
            is_anonymous=False
        )
    
    def test_serializer_includes_basic_fields(self):
        """Test that serializer includes all basic fields"""
        request = self.factory.get('/')
        request.user = self.user
        serializer = PostSerializer(self.post, context={'request': request})
        
        self.assertIn('id', serializer.data)
        self.assertIn('title', serializer.data)
        self.assertIn('content', serializer.data)
        self.assertIn('user', serializer.data)
        self.assertIn('likes_count', serializer.data)
        self.assertIn('liked', serializer.data)
        self.assertIn('comments', serializer.data)
    
    def test_anonymous_post_hides_user_info(self):
        """Test that anonymous posts hide user information"""
        anon_post = Post.objects.create(
            user=self.user,
            title='Anon Post',
            content='Anonymous',
            is_anonymous=True
        )
        
        # Other user viewing
        request = self.factory.get('/')
        request.user = self.other_user
        serializer = PostSerializer(anon_post, context={'request': request})
        
        self.assertEqual(serializer.data['user']['username'], 'Anonymous')
        self.assertEqual(serializer.data['user']['display_name'], 'Anonymous')
        self.assertIsNone(serializer.data['user']['id'])
    
    def test_anonymous_post_shows_user_to_author(self):
        """Test that anonymous posts show user info to the author"""
        anon_post = Post.objects.create(
            user=self.user,
            title='Anon Post',
            content='Anonymous',
            is_anonymous=True
        )
        
        # Author viewing their own post
        request = self.factory.get('/')
        request.user = self.user
        serializer = PostSerializer(anon_post, context={'request': request})
        
        self.assertEqual(serializer.data['user']['username'], 'postuser')
    
    def test_liked_field_for_authenticated_user(self):
        """Test that liked field correctly indicates if user liked the post"""
        from core.models import Like
        
        # Without like
        request = self.factory.get('/')
        request.user = self.user
        serializer = PostSerializer(self.post, context={'request': request})
        self.assertFalse(serializer.data['liked'])
        
        # With like
        Like.objects.create(user=self.user, post=self.post)
        serializer = PostSerializer(self.post, context={'request': request})
        self.assertTrue(serializer.data['liked'])
    
    def test_liked_field_for_unauthenticated_user(self):
        """Test that liked field is False for unauthenticated users"""
        request = self.factory.get('/')
        request.user = None
        serializer = PostSerializer(self.post, context={'request': request})
        self.assertFalse(serializer.data['liked'])


class CommentSerializerTest(TestCase):
    """Test CommentSerializer functionality"""
    
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='commentuser',
            email='comment@yale.edu',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@yale.edu',
            password='testpass123'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            content='Content'
        )
        self.comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Test comment',
            is_anonymous=False
        )
    
    def test_serializer_includes_basic_fields(self):
        """Test that serializer includes all basic fields"""
        request = self.factory.get('/')
        request.user = self.user
        serializer = CommentSerializer(self.comment, context={'request': request})
        
        self.assertIn('id', serializer.data)
        self.assertIn('user', serializer.data)
        self.assertIn('content', serializer.data)
        self.assertIn('is_anonymous', serializer.data)
        self.assertIn('created_at', serializer.data)
        self.assertIn('parent', serializer.data)
        self.assertIn('replies', serializer.data)
    
    def test_anonymous_comment_hides_user_info(self):
        """Test that anonymous comments hide user information"""
        anon_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Anonymous comment',
            is_anonymous=True
        )
        
        # Other user viewing
        request = self.factory.get('/')
        request.user = self.other_user
        serializer = CommentSerializer(anon_comment, context={'request': request})
        
        self.assertEqual(serializer.data['user']['username'], 'Anonymous')
        self.assertEqual(serializer.data['user']['display_name'], 'Anonymous')
        self.assertIsNone(serializer.data['user']['id'])
    
    def test_anonymous_comment_shows_user_to_author(self):
        """Test that anonymous comments show user info to the author"""
        anon_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Anonymous comment',
            is_anonymous=True
        )
        
        # Author viewing their own comment
        request = self.factory.get('/')
        request.user = self.user
        serializer = CommentSerializer(anon_comment, context={'request': request})
        
        self.assertEqual(serializer.data['user']['username'], 'commentuser')
    
    def test_nested_replies_serialization(self):
        """Test that nested replies are properly serialized"""
        # Create a reply
        reply = Comment.objects.create(
            post=self.post,
            user=self.other_user,
            content='Reply comment',
            parent=self.comment
        )
        
        request = self.factory.get('/')
        request.user = self.user
        serializer = CommentSerializer(self.comment, context={'request': request})
        
        # Check replies are included
        self.assertIsInstance(serializer.data['replies'], list)
        self.assertEqual(len(serializer.data['replies']), 1)
        self.assertEqual(serializer.data['replies'][0]['content'], 'Reply comment')
    
    def test_no_replies_returns_empty_list(self):
        """Test that comments without replies return empty list"""
        request = self.factory.get('/')
        request.user = self.user
        serializer = CommentSerializer(self.comment, context={'request': request})
        
        self.assertEqual(serializer.data['replies'], [])


class AnonymityTest(TestCase):
    """Test anonymity logic across serializers"""
    
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@yale.edu',
            password='testpass123'
        )
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@yale.edu',
            password='testpass123',
            is_staff=True
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@yale.edu',
            password='testpass123'
        )
    
    def test_staff_can_see_anonymous_post_author(self):
        """Test that staff users can see anonymous post authors"""
        post = Post.objects.create(
            user=self.user,
            title='Anon Post',
            content='Content',
            is_anonymous=True
        )
        
        request = self.factory.get('/')
        request.user = self.staff_user
        serializer = PostSerializer(post, context={'request': request})
        
        # Staff should see the real username
        self.assertEqual(serializer.data['user']['username'], 'testuser')
    
    def test_staff_can_see_anonymous_comment_author(self):
        """Test that staff users can see anonymous comment authors"""
        post = Post.objects.create(
            user=self.user,
            title='Post',
            content='Content'
        )
        comment = Comment.objects.create(
            post=post,
            user=self.user,
            content='Anonymous comment',
            is_anonymous=True
        )
        
        request = self.factory.get('/')
        request.user = self.staff_user
        serializer = CommentSerializer(comment, context={'request': request})
        
        # Staff should see the real username
        self.assertEqual(serializer.data['user']['username'], 'testuser')
    
    def test_non_anonymous_post_always_shows_author(self):
        """Test that non-anonymous posts always show author info"""
        post = Post.objects.create(
            user=self.user,
            title='Public Post',
            content='Content',
            is_anonymous=False
        )
        
        request = self.factory.get('/')
        request.user = self.other_user
        serializer = PostSerializer(post, context={'request': request})
        
        self.assertEqual(serializer.data['user']['username'], 'testuser')
