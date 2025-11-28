import os
from .settings import *  # noqa: F401,F403

# Use a local SQLite DB for tests so we don't need Postgres permissions here.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'test_db.sqlite3'),
    }
}

# Keep debug on for easier failure inspection
DEBUG = True
