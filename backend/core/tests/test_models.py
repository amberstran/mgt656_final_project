"""
Unit tests for core models - Testing critical business logic
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from core.models import Circle, Post, Comment, Like, CircleMembership, Message, Report

User = get_user_model()


class CustomUserModelTest(TestCase):
    """Test CustomUser model functionality"""
    
    def test_user_creation(self):
        """Test basic user creation"""
        user = User.objects.create_user(
            username='testuser',
            email='test@yale.edu',
            password='testpass123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@yale.edu')
        self.assertFalse(user.is_verified)
        self.assertFalse(user.post_with_real_name)
    
    def test_bio_sanitization(self):
        """Test that user bio is sanitized to prevent XSS"""
        user = User.objects.create_user(
            username='xsstest',
            email='xss@yale.edu',
            password='testpass123'
        )
        
        # Test script tag removal
        user.bio = "Hello <script>alert('xss')</script> world"
        user.save()
        self.assertNotIn('<script>', user.bio)
        self.assertNotIn('</script>', user.bio)
        self.assertIn('Hello', user.bio)
        self.assertIn('world', user.bio)
        
        # Test HTML tag stripping
        user.bio = "Test <b>bold</b> <i>italic</i> <a href='evil.com'>link</a>"
        user.save()
        self.assertNotIn('<b>', user.bio)
        self.assertNotIn('<i>', user.bio)
        self.assertNotIn('<a', user.bio)
        self.assertIn('bold', user.bio)
        self.assertIn('italic', user.bio)
        self.assertIn('link', user.bio)
    
    def test_netid_uniqueness(self):
        """Test that netid must be unique"""
        User.objects.create_user(
            username='user1',
            email='user1@yale.edu',
            password='pass',
            netid='abc123'
        )
        
        # Trying to create another user with same netid should work if blank
        user2 = User.objects.create_user(
            username='user2',
            email='user2@yale.edu',
            password='pass',
            netid=''
        )
        self.assertEqual(user2.netid, '')
    
    def test_user_string_representation(self):
        """Test __str__ method"""
        user = User.objects.create_user(
            username='stringtest',
            email='string@yale.edu',
            password='pass'
        )
        self.assertEqual(str(user), 'stringtest')


class CircleModelTest(TestCase):
    """Test Circle model functionality"""
    
    def test_circle_creation(self):
        """Test basic circle creation"""
        circle = Circle.objects.create(
            name='Test Circle',
            description='A test circle'
        )
        self.assertEqual(circle.name, 'Test Circle')
        self.assertEqual(circle.description, 'A test circle')
    
    def test_circle_string_representation(self):
        """Test __str__ method"""
        circle = Circle.objects.create(name='My Circle')
        self.assertEqual(str(circle), 'My Circle')


class PostModelTest(TestCase):
    """Test Post model functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='postuser',
            email='post@yale.edu',
            password='pass'
        )
        self.circle = Circle.objects.create(name='Test Circle')
    
    def test_post_creation(self):
        """Test basic post creation"""
        post = Post.objects.create(
            user=self.user,
            title='Test Post',
            content='This is test content',
            is_anonymous=False
        )
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(post.content, 'This is test content')
        self.assertFalse(post.is_anonymous)
        self.assertEqual(post.user, self.user)
    
    def test_anonymous_post_creation(self):
        """Test anonymous post creation"""
        post = Post.objects.create(
            user=self.user,
            title='Anonymous Post',
            content='Anonymous content',
            is_anonymous=True
        )
        self.assertTrue(post.is_anonymous)
    
    def test_post_with_circle(self):
        """Test post associated with a circle"""
        post = Post.objects.create(
            user=self.user,
            title='Circle Post',
            content='Posted in circle',
            circle=self.circle
        )
        self.assertEqual(post.circle, self.circle)
    
    def test_post_string_representation(self):
        """Test __str__ method for anonymous and non-anonymous posts"""
        post_public = Post.objects.create(
            user=self.user,
            title='Public Post',
            content='Content',
            is_anonymous=False
        )
        self.assertIn('Public Post', str(post_public))
        self.assertIn(self.user.username, str(post_public))
        
        post_anon = Post.objects.create(
            user=self.user,
            title='Anon Post',
            content='Content',
            is_anonymous=True
        )
        self.assertIn('Anon Post', str(post_anon))
        self.assertIn('Anonymous', str(post_anon))


class CommentModelTest(TestCase):
    """Test Comment model functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='commentuser',
            email='comment@yale.edu',
            password='pass'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            content='Content'
        )
    
    def test_comment_creation(self):
        """Test basic comment creation"""
        comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Test comment',
            is_anonymous=False
        )
        self.assertEqual(comment.content, 'Test comment')
        self.assertEqual(comment.post, self.post)
        self.assertEqual(comment.user, self.user)
        self.assertFalse(comment.is_anonymous)
    
    def test_nested_comment_creation(self):
        """Test creating nested comments (replies)"""
        parent_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Parent comment'
        )
        
        reply = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Reply comment',
            parent=parent_comment
        )
        
        self.assertEqual(reply.parent, parent_comment)
        self.assertIn(reply, parent_comment.replies.all())
    
    def test_comment_string_representation(self):
        """Test __str__ method"""
        comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content='Test',
            is_anonymous=True
        )
        self.assertIn('Anonymous', str(comment))


class LikeModelTest(TestCase):
    """Test Like model functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='likeuser',
            email='like@yale.edu',
            password='pass'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            content='Content'
        )
    
    def test_like_creation(self):
        """Test creating a like"""
        like = Like.objects.create(user=self.user, post=self.post)
        self.assertEqual(like.user, self.user)
        self.assertEqual(like.post, self.post)
    
    def test_like_uniqueness(self):
        """Test that a user can only like a post once"""
        Like.objects.create(user=self.user, post=self.post)
        
        # Attempting to create duplicate like should raise error
        with self.assertRaises(Exception):
            Like.objects.create(user=self.user, post=self.post)
    
    def test_like_string_representation(self):
        """Test __str__ method"""
        like = Like.objects.create(user=self.user, post=self.post)
        str_repr = str(like)
        self.assertIn(self.user.username, str_repr)


class CircleMembershipModelTest(TestCase):
    """Test CircleMembership model functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='memberuser',
            email='member@yale.edu',
            password='pass'
        )
        self.circle = Circle.objects.create(name='Test Circle')
    
    def test_membership_creation(self):
        """Test creating circle membership"""
        membership = CircleMembership.objects.create(
            user=self.user,
            circle=self.circle
        )
        self.assertEqual(membership.user, self.user)
        self.assertEqual(membership.circle, self.circle)
        self.assertIsNotNone(membership.joined_at)
    
    def test_membership_uniqueness(self):
        """Test that a user can only join a circle once"""
        CircleMembership.objects.create(user=self.user, circle=self.circle)
        
        # Attempting to create duplicate membership should raise error
        with self.assertRaises(Exception):
            CircleMembership.objects.create(user=self.user, circle=self.circle)
    
    def test_membership_string_representation(self):
        """Test __str__ method"""
        membership = CircleMembership.objects.create(
            user=self.user,
            circle=self.circle
        )
        str_repr = str(membership)
        self.assertIn(self.user.username, str_repr)
        self.assertIn(self.circle.name, str_repr)


class MessageModelTest(TestCase):
    """Test Message model functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='msguser',
            email='msg@yale.edu',
            password='pass'
        )
        self.circle = Circle.objects.create(name='Test Circle')
    
    def test_message_creation(self):
        """Test creating a message in a circle"""
        message = Message.objects.create(
            circle=self.circle,
            user=self.user,
            content='Test message',
            is_anonymous=False
        )
        self.assertEqual(message.content, 'Test message')
        self.assertEqual(message.circle, self.circle)
        self.assertEqual(message.user, self.user)
        self.assertFalse(message.is_anonymous)
        self.assertIsNotNone(message.timestamp)
    
    def test_anonymous_message(self):
        """Test anonymous message"""
        message = Message.objects.create(
            circle=self.circle,
            user=self.user,
            content='Anonymous message',
            is_anonymous=True
        )
        self.assertTrue(message.is_anonymous)
    
    def test_message_string_representation(self):
        """Test __str__ method"""
        message = Message.objects.create(
            circle=self.circle,
            user=self.user,
            content='Test',
            is_anonymous=True
        )
        str_repr = str(message)
        self.assertIn(self.circle.name, str_repr)
        self.assertIn('Anonymous', str_repr)


class ReportModelTest(TestCase):
    """Test Report model functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='reportuser',
            email='report@yale.edu',
            password='pass'
        )
    
    def test_report_creation(self):
        """Test creating a report"""
        report = Report.objects.create(
            user=self.user,
            content_type='post',
            object_id=1,
            reason='Inappropriate content',
            status='pending'
        )
        self.assertEqual(report.user, self.user)
        self.assertEqual(report.content_type, 'post')
        self.assertEqual(report.object_id, 1)
        self.assertEqual(report.reason, 'Inappropriate content')
        self.assertEqual(report.status, 'pending')
        self.assertIsNotNone(report.created_at)
    
    def test_report_status_choices(self):
        """Test different report statuses"""
        for status in ['pending', 'resolved', 'dismissed']:
            report = Report.objects.create(
                user=self.user,
                content_type='comment',
                object_id=1,
                reason='Test',
                status=status
            )
            self.assertEqual(report.status, status)
    
    def test_report_content_type_choices(self):
        """Test different content types"""
        for content_type in ['post', 'comment', 'message']:
            report = Report.objects.create(
                user=self.user,
                content_type=content_type,
                object_id=1,
                reason='Test'
            )
            self.assertEqual(report.content_type, content_type)
    
    def test_report_string_representation(self):
        """Test __str__ method"""
        report = Report.objects.create(
            user=self.user,
            content_type='post',
            object_id=42,
            reason='Test'
        )
        str_repr = str(report)
        self.assertIn(self.user.username, str_repr)
        self.assertIn('post', str_repr)
        self.assertIn('42', str_repr)
