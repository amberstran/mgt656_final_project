#!/bin/bash
# Build script for Django backend on Render

set -o errexit

# Install dependencies
pip install -r ../requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations (this will be done automatically by Render, but good to have here)
python manage.py migrate --noinput

echo "Build completed successfully!"

