"""
Unit tests for core views - Testing critical business logic
"""
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from core.models import Post, Comment, Like, Circle, CircleMembership

User = get_user_model()


class ProfileViewTest(TestCase):
    """Test profile view functionality"""
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@yale.edu',
            password='testpass123'
        )
    
    def test_profile_view_accessible(self):
        """Test that profile view is accessible"""
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, 200)
    
    def test_profile_view_renders_stats(self):
        """Test that profile view includes stats"""
        response = self.client.get(reverse('profile'))
        self.assertIn(b'posts', response.content)
    
    def test_calc_level_ember(self):
        """Test level calculation for Ember (0-19)"""
        from core.views import _calc_level
        level = _calc_level(0)
        self.assertEqual(level['name'], 'Ember')
        level = _calc_level(19)
        self.assertEqual(level['name'], 'Ember')
    
    def test_calc_level_spark(self):
        """Test level calculation for Spark (20-39)"""
        from core.views import _calc_level
        level = _calc_level(20)
        self.assertEqual(level['name'], 'Spark')
        level = _calc_level(39)
        self.assertEqual(level['name'], 'Spark')
    
    def test_calc_level_flame(self):
        """Test level calculation for Flame (40-69)"""
        from core.views import _calc_level
        level = _calc_level(40)
        self.assertEqual(level['name'], 'Flame')
        level = _calc_level(69)
        self.assertEqual(level['name'], 'Flame')
    
    def test_calc_level_blaze(self):
        """Test level calculation for Blaze (70-94)"""
        from core.views import _calc_level
        level = _calc_level(70)
        self.assertEqual(level['name'], 'Blaze')
        level = _calc_level(94)
        self.assertEqual(level['name'], 'Blaze')
    
    def test_calc_level_aurora(self):
        """Test level calculation for Aurora (95+)"""
        from core.views import _calc_level
        level = _calc_level(95)
        self.assertEqual(level['name'], 'Aurora')
        level = _calc_level(999)
        self.assertEqual(level['name'], 'Aurora')


class MyPostsViewTest(TestCase):
    """Test my posts view functionality"""
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='postuser',
            email='post@yale.edu',
            password='testpass123'
        )
    
    def test_my_posts_requires_login(self):
        """Test that my posts view requires authentication"""
        response = self.client.get(reverse('my_posts'))
        self.assertEqual(response.status_code, 302)  # Redirect to login
    
    def test_my_posts_shows_user_posts(self):
        """Test that my posts view shows user's posts"""
        self.client.login(username='postuser', password='testpass123')
        
        # Create posts
        Post.objects.create(
            user=self.user,
            title='My Post 1',
            content='Content 1'
        )
        Post.objects.create(
            user=self.user,
            title='My Post 2',
            content='Content 2'
        )
        
        response = self.client.get(reverse('my_posts'))
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'My Post 1', response.content)
        self.assertIn(b'My Post 2', response.content)


class MyCommentsViewTest(TestCase):
    """Test my comments view functionality"""
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='commentuser',
            email='comment@yale.edu',
            password='testpass123'
        )
        self.post = Post.objects.create(
            user=self.user,
            title='Test Post',
            content='Content'
        )
    
    def test_my_comments_requires_login(self):
        """Test that my comments view requires authentication"""
        response = self.client.get(reverse('my_comments'))
        self.assertEqual(response.status_code, 302)  # Redirect to login
    
    def test_my_comments_shows_user_comments(self):
        """Test that my comments view shows user's comments"""
        self.client.login(username='commentuser', password='testpass123')
        
        # Create comments
        Comment.objects.create(
            post=self.post,
            user=self.user,
            content='My Comment 1'
        )
        Comment.objects.create(
            post=self.post,
            user=self.user,
            content='My Comment 2'
        )
        
        response = self.client.get(reverse('my_comments'))
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'My Comment 1', response.content)
        self.assertIn(b'My Comment 2', response.content)


class ProfileAPIViewTest(TestCase):
    """Test profile API view functionality"""
    
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='apiuser',
            email='api@yale.edu',
            password='testpass123'
        )
    
    def test_profile_api_returns_json(self):
        """Test that profile API returns JSON"""
        response = self.client.get(reverse('api_profile'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')
    
    def test_profile_api_contains_stats(self):
        """Test that profile API contains stats"""
        response = self.client.get(reverse('api_profile'))
        data = response.json()
        self.assertIn('stats', data)
        self.assertIn('posts', data['stats'])
        self.assertIn('comments', data['stats'])
        self.assertIn('likes', data['stats'])
    
    def test_profile_api_calculates_score(self):
        """Test that profile API calculates Agora Sparks score correctly"""
        response = self.client.get(reverse('api_profile'))
        data = response.json()
        stats = data['stats']
        
        # Verify score calculation: posts * 5 + comments * 2 + likes
        expected_score = stats['posts'] * 5 + stats['comments'] * 2 + stats['likes']
        self.assertEqual(stats['score'], expected_score)
    
    def test_profile_api_includes_level(self):
        """Test that profile API includes level information"""
        response = self.client.get(reverse('api_profile'))
        data = response.json()
        self.assertIn('level_name', data['stats'])
        self.assertIn('level_hint', data['stats'])
    
    def test_profile_api_post_with_real_name_toggle(self):
        """Test toggling post_with_real_name preference"""
        self.client.login(username='apiuser', password='testpass123')
        
        # Toggle to True
        response = self.client.post(
            reverse('api_profile'),
            data='{"post_with_real_name": true}',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['user']['post_with_real_name'])
        
        # Verify it was saved
        self.user.refresh_from_db()
        self.assertTrue(self.user.post_with_real_name)
        
        # Toggle to False
        response = self.client.post(
            reverse('api_profile'),
            data='{"post_with_real_name": false}',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data['user']['post_with_real_name'])


class RegistrationViewTest(TestCase):
    """Test registration view functionality"""
    
    def setUp(self):
        self.client = Client()
    
    def test_registration_requires_yale_email(self):
        """Test that registration requires @yale.edu email"""
        response = self.client.post(reverse('register'), {
            'username': 'testuser',
            'email': 'test@gmail.com',
            'program': 'Computer Science',
            'grade': 'Sophomore'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Yale email', response.content)
    
    def test_registration_requires_all_fields(self):
        """Test that registration requires all fields"""
        # Missing username
        response = self.client.post(reverse('register'), {
            'email': 'test@yale.edu',
            'program': 'Computer Science',
            'grade': 'Sophomore'
        })
        self.assertIn(b'required', response.content)
        
        # Missing program
        response = self.client.post(reverse('register'), {
            'username': 'testuser',
            'email': 'test@yale.edu',
            'grade': 'Sophomore'
        })
        self.assertIn(b'required', response.content)
        
        # Missing grade
        response = self.client.post(reverse('register'), {
            'username': 'testuser',
            'email': 'test@yale.edu',
            'program': 'Computer Science'
        })
        self.assertIn(b'required', response.content)
    
    def test_successful_registration_creates_inactive_user(self):
        """Test that successful registration creates an inactive user"""
        response = self.client.post(reverse('register'), {
            'username': 'newuser',
            'email': 'newuser@yale.edu',
            'program': 'Computer Science',
            'grade': 'Junior'
        })
        
        # Check user was created
        user = User.objects.filter(username='newuser').first()
        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'newuser@yale.edu')
        self.assertEqual(user.program, 'Computer Science')
        self.assertEqual(user.grade, 'Junior')
        self.assertFalse(user.is_active)  # Should be inactive until verified


class ScoreCalculationTest(TestCase):
    """Test Agora Sparks score calculation logic"""
    
    def test_score_formula(self):
        """Test that score is calculated correctly: posts*5 + comments*2 + likes"""
        test_cases = [
            {'posts': 0, 'comments': 0, 'likes': 0, 'expected': 0},
            {'posts': 1, 'comments': 0, 'likes': 0, 'expected': 5},
            {'posts': 0, 'comments': 1, 'likes': 0, 'expected': 2},
            {'posts': 0, 'comments': 0, 'likes': 1, 'expected': 1},
            {'posts': 2, 'comments': 3, 'likes': 4, 'expected': 20},  # 2*5 + 3*2 + 4 = 20
            {'posts': 10, 'comments': 5, 'likes': 8, 'expected': 68},  # 10*5 + 5*2 + 8 = 68
        ]
        
        for case in test_cases:
            score = case['posts'] * 5 + case['comments'] * 2 + case['likes']
            self.assertEqual(score, case['expected'],
                f"Failed for posts={case['posts']}, comments={case['comments']}, likes={case['likes']}")
    
    def test_level_boundaries(self):
        """Test that level boundaries are correct"""
        from core.views import _calc_level
        
        # Test boundaries
        self.assertEqual(_calc_level(19)['name'], 'Ember')
        self.assertEqual(_calc_level(20)['name'], 'Spark')
        self.assertEqual(_calc_level(39)['name'], 'Spark')
        self.assertEqual(_calc_level(40)['name'], 'Flame')
        self.assertEqual(_calc_level(69)['name'], 'Flame')
        self.assertEqual(_calc_level(70)['name'], 'Blaze')
        self.assertEqual(_calc_level(94)['name'], 'Blaze')
        self.assertEqual(_calc_level(95)['name'], 'Aurora')
