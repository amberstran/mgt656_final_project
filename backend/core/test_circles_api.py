from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from core.models import Circle, CircleMembership, Post


User = get_user_model()


class CirclesAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_member = User.objects.create_user(username='member', password='pass')
        self.user_non = User.objects.create_user(username='nonmember', password='pass')
        self.circle = Circle.objects.create(name='Test Circle', description='A test circle')

    def test_join_and_leave_circle(self):
        # Non-authenticated cannot join
        resp = self.client.post(f'/api/circles/{self.circle.id}/join/')
        self.assertEqual(resp.status_code, 401)

        # Authenticated user can join
        self.client.force_authenticate(self.user_member)
        resp = self.client.post(f'/api/circles/{self.circle.id}/join/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(CircleMembership.objects.filter(user=self.user_member, circle=self.circle).exists())

        # Joining again should not create duplicate
        resp2 = self.client.post(f'/api/circles/{self.circle.id}/join/')
        self.assertEqual(resp2.status_code, 200)
        self.assertIn('created', resp2.data)

        # Leave
        resp3 = self.client.post(f'/api/circles/{self.circle.id}/leave/')
        self.assertEqual(resp3.status_code, 200)
        self.assertFalse(CircleMembership.objects.filter(user=self.user_member, circle=self.circle).exists())

    def test_post_visibility_and_creation_requires_membership(self):
        # Create membership for member and a post in the circle by that member
        CircleMembership.objects.create(user=self.user_member, circle=self.circle)
        post = Post.objects.create(user=self.user_member, title='Hello', content='World', is_anonymous=False, circle=self.circle)

        # Non-member should not see circle posts
        self.client.force_authenticate(self.user_non)
        resp = self.client.get(f'/api/posts/?circle={self.circle.id}')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 0)

        # Member should see the post
        self.client.force_authenticate(self.user_member)
        resp2 = self.client.get(f'/api/posts/?circle={self.circle.id}')
        self.assertEqual(resp2.status_code, 200)
        self.assertGreaterEqual(len(resp2.data), 1)

        # Non-member cannot create a new post in the circle via API
        self.client.force_authenticate(self.user_non)
        resp3 = self.client.post('/api/posts/', {'title': 'X', 'content': 'Y', 'circle': self.circle.id}, format='json')
        self.assertIn(resp3.status_code, (400, 403), msg=f"Unexpected status {resp3.status_code} response: {resp3.data}")

        # Member can create
        self.client.force_authenticate(self.user_member)
        resp4 = self.client.post('/api/posts/', {'title': 'Member Post', 'content': 'Hi', 'circle': self.circle.id}, format='json')
        self.assertEqual(resp4.status_code, 201)
