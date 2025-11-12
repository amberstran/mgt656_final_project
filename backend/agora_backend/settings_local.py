from .settings import *
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

for t in TEMPLATES:
    if "DIRS" in t:
        t["DIRS"] = [BASE_DIR / "agora_frontend" / "templates"] + t.get("DIRS", [])
