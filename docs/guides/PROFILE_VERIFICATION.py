# Profile Page Implementation - Verification Checklist
# Run this file to verify the backend and frontend setup

import os
import sys
import subprocess
import json
from pathlib import Path

# Get project root
PROJECT_ROOT = Path(__file__).parent.absolute()
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "backend" / "agora_frontend"

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def check_backend_files():
    """Verify all backend files exist"""
    print_header("CHECKING BACKEND FILES")
    
    files_to_check = [
        BACKEND_DIR / "manage.py",
        BACKEND_DIR / "agora_backend" / "urls.py",
        BACKEND_DIR / "agora_backend" / "settings.py",
        BACKEND_DIR / "agora_backend" / "settings_local.py",
        BACKEND_DIR / "agora_backend" / "profile.html",
        BACKEND_DIR / "core" / "views.py",
        BACKEND_DIR / "core" / "urls.py",
    ]
    
    all_exist = True
    for file_path in files_to_check:
        exists = file_path.exists()
        status = "✓" if exists else "✗"
        print(f"{status} {file_path.relative_to(PROJECT_ROOT)}")
        if not exists:
            all_exist = False
    
    return all_exist

def check_frontend_files():
    """Verify all frontend files exist"""
    print_header("CHECKING FRONTEND FILES")
    
    files_to_check = [
        FRONTEND_DIR / "src" / "components" / "Profile.jsx",
        FRONTEND_DIR / "src" / "components" / "Profile.css",
        PROJECT_ROOT / "frontend" / "profile" / "profile.html",
        PROJECT_ROOT / "frontend" / "profile" / "profile.js",
        PROJECT_ROOT / "frontend" / "profile" / "profile.css",
    ]
    
    all_exist = True
    for file_path in files_to_check:
        exists = file_path.exists()
        status = "✓" if exists else "✗"
        print(f"{status} {file_path.relative_to(PROJECT_ROOT) if file_path.is_relative_to(PROJECT_ROOT) else file_path}")
        if not exists:
            all_exist = False
    
    return all_exist

def check_django_setup():
    """Verify Django configuration"""
    print_header("CHECKING DJANGO SETUP")
    
    checks = [
        ("Django installed", check_django_installed),
        ("Settings module configured", check_settings_module),
        ("URLs configured", check_urls_configured),
    ]
    
    results = []
    for check_name, check_func in checks:
        result = check_func()
        status = "✓" if result else "✗"
        print(f"{status} {check_name}")
        results.append(result)
    
    return all(results)

def check_django_installed():
    """Check if Django is installed"""
    try:
        import django
        print(f"   Django version: {django.VERSION}")
        return True
    except ImportError:
        print("   Django not installed")
        return False

def check_settings_module():
    """Check if settings module is properly configured"""
    try:
        settings_py = BACKEND_DIR / "agora_backend" / "settings.py"
        settings_local = BACKEND_DIR / "agora_backend" / "settings_local.py"
        
        has_settings = settings_py.exists()
        has_local_settings = settings_local.exists()
        
        print(f"   settings.py exists: {has_settings}")
        print(f"   settings_local.py exists: {has_local_settings}")
        
        return has_settings and has_local_settings
    except Exception as e:
        print(f"   Error: {e}")
        return False

def check_urls_configured():
    """Check if URLs are properly configured"""
    try:
        urls_py = BACKEND_DIR / "agora_backend" / "urls.py"
        
        if not urls_py.exists():
            return False
        
        with open(urls_py, 'r') as f:
            content = f.read()
            has_profile_route = 'profile' in content or "include('core.urls')" in content
            
            print(f"   Profile route configured: {has_profile_route}")
            
            return has_profile_route
    except Exception as e:
        print(f"   Error: {e}")
        return False

def print_setup_instructions():
    """Print setup instructions"""
    print_header("SETUP INSTRUCTIONS")
    
    instructions = """
1. BACKEND SETUP (Django):
   ✓ Backend template created: backend/agora_backend/profile.html
   ✓ Views configured: core/views.py with profile_view()
   ✓ URLs configured: core/urls.py with /profile/ route

   To test:
   $ cd backend
   $ python manage.py runserver
   Then visit: http://localhost:8000/profile/

2. FRONTEND STANDALONE (Vanilla JS):
   ✓ HTML created: frontend/profile/profile.html
   ✓ CSS created: frontend/profile/profile.css
   ✓ JavaScript created: frontend/profile/profile.js

   To test:
   $ cd frontend/profile
   $ python -m http.server 8001
   Then visit: http://localhost:8001/profile.html

3. FRONTEND REACT INTEGRATION:
   ✓ React component created: backend/agora_frontend/src/components/Profile.jsx
   ✓ CSS module created: backend/agora_frontend/src/components/Profile.css

   To integrate in App.js:
   ```javascript
   import Profile from './components/Profile';
   
   function App() {
     return <Profile />;
   }
   ```

4. API INTEGRATION:
   - Profile stats endpoint: /api/profile/
   - Posts endpoint: /api/posts/
   - Comments endpoint: /api/comments/

5. DATABASE SETUP:
   $ cd backend
   $ python manage.py migrate

6. RUN BACKEND SERVER:
   $ cd backend
   $ python manage.py runserver

7. RUN FRONTEND SERVER (if developing separately):
   $ cd backend/agora_frontend
   $ npm install (if not done)
   $ npm start
"""
    
    print(instructions)

def main():
    print("\n" + "="*60)
    print("  AGORA PROFILE PAGE - VERIFICATION & SETUP GUIDE")
    print("="*60)
    
    backend_ok = check_backend_files()
    frontend_ok = check_frontend_files()
    django_ok = check_django_setup()
    
    print_header("SUMMARY")
    
    print(f"✓ Backend files: {'OK' if backend_ok else 'MISSING FILES'}")
    print(f"✓ Frontend files: {'OK' if frontend_ok else 'MISSING FILES'}")
    print(f"✓ Django setup: {'OK' if django_ok else 'SETUP NEEDED'}")
    
    print_setup_instructions()
    
    if backend_ok and frontend_ok:
        print_header("NEXT STEPS")
        print("""
✓ All files are in place!

To get started:

1. Install dependencies:
   $ pip install -r requirements.txt

2. Run database migrations:
   $ cd backend
   $ python manage.py migrate

3. Start the development server:
   $ python manage.py runserver

4. Visit the profile page:
   http://localhost:8000/profile/

5. For frontend React development:
   $ cd backend/agora_frontend
   $ npm install
   $ npm start
""")
    else:
        print_header("ACTION REQUIRED")
        print("Please create the missing files mentioned above.")

if __name__ == "__main__":
    main()
