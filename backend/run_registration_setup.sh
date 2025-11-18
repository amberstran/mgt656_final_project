#!/usr/bin/env bash
set -euo pipefail

# Small convenience script to prepare the Django backend for registration testing.
# It will activate the venv (assumes venv at ../venv), run migrations, and ensure a superuser exists.

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENVDIR="$BASE_DIR/../venv"

echo "Working directory: $BASE_DIR"

if [ -f "$VENVDIR/bin/activate" ]; then
  # shellcheck disable=SC1090
  source "$VENVDIR/bin/activate"
  echo "Activated venv: $VENVDIR"
else
  echo "Warning: venv not found at $VENVDIR. You may need to activate your environment manually." >&2
fi

echo "Running migrations..."
python manage.py migrate --noinput

echo "Skipping collectstatic in this dev script (STATIC_ROOT may be unset)."

echo "Ensuring superuser 'admin' exists (password: admin) for quick testing..."
# Use manage.py shell so Django settings are configured
python manage.py shell -c $'from django.contrib.auth import get_user_model\nUser = get_user_model()\nuser, created = User.objects.get_or_create(username="admin", defaults={"email": "admin@example.com"})\nif created:\n    user.set_password("admin")\n    user.is_staff = True\n    user.is_superuser = True\n    user.save()\n    print("✅ Superuser created: admin/admin")\nelse:\n    print("✅ Superuser already exists")'

echo "Setup complete. Run the dev server with:"
echo "  source ../venv/bin/activate && python manage.py runserver"
#!/usr/bin/env bash
set -euo pipefail

# Small helper to run checks, migrations and ensure a dev superuser exists.
# Usage:
#   ./run_registration_setup.sh          # run checks, makemigrations, migrate, ensure superuser
#   ./run_registration_setup.sh runserver  # also start the dev server at the end

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="${ROOT_DIR}/../venv"
ACTIVATE_SCRIPT="${VENV_DIR}/bin/activate"

if [ ! -f "$ACTIVATE_SCRIPT" ]; then
  echo "Virtualenv activate script not found at: $ACTIVATE_SCRIPT"
  echo "Please create/activate your virtualenv (expected ../venv) or run the commands manually."
  exit 1
fi

# shellcheck source=/dev/null
source "$ACTIVATE_SCRIPT"
echo "Activated virtualenv: $ACTIVATE_SCRIPT"

cd "$ROOT_DIR"

echo "\n==> Running Django system check"
python manage.py check

echo "\n==> Making migrations (if any)"
# makemigrations may return non-zero if there are no changes in some Django versions; ignore failures
python manage.py makemigrations --noinput || true

echo "\n==> Applying migrations"
python manage.py migrate --noinput

echo "\n==> Ensure superuser 'admin' exists (dev only)"
python manage.py shell <<'PY'
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('✅ Superuser created: admin/admin')
else:
    print('✅ Superuser already exists')
PY

echo "\nAll done. To run the dev server:"
echo "  cd $ROOT_DIR && python manage.py runserver"

if [ "${1:-}" = "runserver" ]; then
  echo "\nStarting dev server..."
  python manage.py runserver
fi
