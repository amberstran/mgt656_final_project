# core/tests.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

class ProfileViewTest(TestCase):
    def setUp(self):
        self.client = Client()
    
    def test_profile_view_accessible(self):
        """Test that profile view is publicly accessible"""
        response = self.client.get(reverse('profile'))
        # Profile view is public, should return 200
        self.assertEqual(response.status_code, 200)
    
    def test_profile_api_view_accessible(self):
        """Test that profile API view is publicly accessible"""
        response = self.client.get(reverse('api_profile'))
        # Profile API is public, should return 200
        self.assertEqual(response.status_code, 200)

    def test_bio_sanitized_on_save(self):
        """Ensure that user.bio gets sanitized to prevent stored XSS"""
        User = get_user_model()
        raw_bio = "Hello <script>alert('evil')</script> world <b>bold</b>"
        u = User.objects.create_user(username="xuser", email="x@yale.edu", password="p")
        u.bio = raw_bio
        u.save()

        # bio should not contain script tags
        self.assertNotIn('<script>', u.bio)
        self.assertNotIn('</script>', u.bio)
        # allowed tags stripped; we remove <b> as well because we strip all tags
        self.assertNotIn('<b>', u.bio)
