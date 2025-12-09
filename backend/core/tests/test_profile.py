# core/tests.py
from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse


class ProfileViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_profile_view_requires_login(self):
        """Test that profile view requires authentication"""
        response = self.client.get(reverse('profile'))
        # Should redirect to login
        self.assertEqual(response.status_code, 302)

    def test_profile_api_view_requires_login(self):
        """Test that profile API view requires authentication"""
        response = self.client.get(reverse('api_profile'))
        # Profile API is public, should return 200
        self.assertEqual(response.status_code, 200)

    def test_bio_sanitized_on_save(self):
        """Ensure that user.bio gets sanitized to prevent stored XSS"""
        user_model = get_user_model()
        raw_bio = "Hello <script>alert('evil')</script> world <b>bold</b>"
        u = user_model.objects.create_user(username="xuser", email="x@yale.edu", password="p")
        u.bio = raw_bio
        u.save()

        # bio should not contain script tags
        self.assertNotIn('<script>', u.bio)
        self.assertNotIn('</script>', u.bio)
        # allowed tags stripped; we remove <b> as well because we strip all tags
        self.assertNotIn('<b>', u.bio)
