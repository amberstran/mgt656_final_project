# Render Cross-Origin Cookie Issue - Solutions

## The Problem
When frontend and backend are deployed as **separate services** on Render (different subdomains), browsers block cookies in cross-origin requests. This causes:
- ❌ CSRF token not being set
- ❌ Session cookies not being stored
- ❌ Authentication not persisting

## Current Setup
- Frontend: `https://agora-frontend-16kz.onrender.com`
- Backend: `https://agora-backend-vavf.onrender.com`
- Different origins → Cookies blocked by browser

## Solution 1: Deploy as Single Service (RECOMMENDED)

### Make Backend Serve Frontend Static Files

This is the best solution for Render free tier. Combine both into one service:

1. **Build the frontend** and copy to backend's static folder
2. **Configure Django** to serve React build
3. **Deploy only the backend** service to Render

#### Steps:

**A. Update Django settings:**

Add to `settings.py`:
```python
# Serve React frontend
TEMPLATES[0]['DIRS'] = [os.path.join(BASE_DIR, 'agora_frontend/build')]

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'agora_frontend/build/static'),
]
```

**B. Update main `urls.py`:**
```python
from django.views.generic import TemplateView

urlpatterns = [
    # ... existing API paths ...
    
    # Serve React app for all other routes
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]
```

**C. Update build script (`build.sh`):**
```bash
#!/usr/bin/env bash
set -o errexit

# Install backend dependencies
pip install -r requirements.txt

# Build frontend
cd agora_frontend
npm install
npm run build
cd ..

# Run migrations
python manage.py collectstatic --no-input
python manage.py migrate
```

**D. Deploy:**
- Keep only the **backend** service on Render
- Delete the frontend service
- Frontend will be served from backend at same origin
- Cookies will work! ✅

## Solution 2: Configure Custom Domain (Requires Paid Plan)

If you have a custom domain and Render's paid plan:

1. Use subdomain routing:
   - Frontend: `app.yourdomain.com`
   - Backend: `api.yourdomain.com`
   
2. Set cookies with `domain=.yourdomain.com`

3. Update Django settings:
```python
SESSION_COOKIE_DOMAIN = '.yourdomain.com'
CSRF_COOKIE_DOMAIN = '.yourdomain.com'
```

## Solution 3: Use Session Storage Instead of Cookies (Not Recommended)

Store auth tokens in localStorage and send with every request. 
❌ Less secure
❌ Vulnerable to XSS attacks
❌ Not recommended for production

## Current Workaround (Temporary)

For now, the app works with these limitations:
- ✅ Registration creates users successfully
- ✅ Users are auto-logged in after registration
- ⚠️ Sessions may not persist across page reloads
- ⚠️ CSRF protection may fail intermittently

**Recommendation:** Implement Solution 1 (single service deployment) for reliable production use.

## Testing After Implementation

After implementing Solution 1:
1. Register a new user
2. Refresh the page
3. Check that you're still logged in ✅
4. Create a post ✅
5. Comment on posts ✅
6. All features should work!
