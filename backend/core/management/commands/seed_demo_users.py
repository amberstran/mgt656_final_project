import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Seed a demo (non-superuser) account based on environment variables. Idempotent."

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.getenv("DEMO_USERNAME")
        password = os.getenv("DEMO_PASSWORD")
        is_staff = os.getenv("DEMO_IS_STAFF", "False").strip().lower() == "true"
        if not username or not password:
            self.stdout.write("[seed_demo_users] DEMO_USERNAME or DEMO_PASSWORD not set; skipping demo user creation.")
            return
        if User.objects.filter(username=username).exists():
            self.stdout.write(f"[seed_demo_users] User '{username}' already exists; skipping.")
            return
        user = User.objects.create_user(username=username, password=password)
        if is_staff:
            user.is_staff = True
            user.save(update_fields=["is_staff"])
        self.stdout.write(f"[seed_demo_users] Created demo user '{username}' (staff={is_staff}).")
