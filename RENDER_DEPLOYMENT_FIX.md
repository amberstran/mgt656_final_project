# Render Deployment Fix Guide

This guide addresses the "no posts" error and 400 status error on login for your deployed application on Render.

## Issues Identified

1. **CORS Configuration**: The frontend cannot communicate with the backend API due to CORS restrictions
2. **CSRF Configuration**: Missing CSRF trusted origins for production
3. **Session Cookie Settings**: Not configured for cross-origin authentication
4. **Missing Environment Variables**: Required Render environment variables not set

## Solution

### Step 1: Update Backend Environment Variables on Render

Go to your **backend service** on Render (agora-backend) and add/update these environment variables:

#### Required Environment Variables:

```bash
# Your backend URL (get this from Render dashboard)
ALLOWED_HOSTS=your-backend-name.onrender.com

# Your frontend URL (get this from Render dashboard)
CORS_ALLOWED_ORIGINS=https://your-frontend-name.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-name.onrender.com

# Security settings
DEBUG=False
SECRET_KEY=your-secret-key-here  # Generate with: python -c "import secrets; print(secrets.token_urlsafe(50))"

# Database (should already be set from Render PostgreSQL)
DATABASE_URL=postgresql://...  # This is auto-populated if you linked PostgreSQL database

# Optional: Email configuration (if you're using email features)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@agora.yale.edu
```

**Important Notes:**
- Replace `your-backend-name` with your actual backend service name on Render
- Replace `your-frontend-name` with your actual frontend service name on Render
- Make sure URLs use `https://` (not `http://`) for production
- If you have multiple frontend URLs (e.g., for testing), separate them with commas:
  ```
  CORS_ALLOWED_ORIGINS=https://frontend1.onrender.com,https://frontend2.onrender.com
  ```

### Step 2: Update Frontend Environment Variables on Render

Go to your **frontend service** on Render (agora-frontend) and add/update:

```bash
# Your backend URL (must match the backend service URL)
REACT_APP_API_URL=https://your-backend-name.onrender.com

# Node version (if not already set)
NODE_VERSION=20.18.0
```

### Step 3: Redeploy Both Services

After updating environment variables:

1. Go to your backend service on Render
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for backend to finish deploying
4. Go to your frontend service on Render
5. Click "Manual Deploy" → "Deploy latest commit"
6. Wait for frontend to finish deploying

### Step 4: Run Database Migrations (If Not Already Done)

If this is your first deployment or you haven't run migrations:

1. Go to your backend service on Render
2. Click on the "Shell" tab
3. Run these commands:
   ```bash
   cd backend
   python manage.py migrate
   python manage.py createsuperuser  # Optional: create admin account
   ```

### Step 5: Test the Deployment

1. Visit your frontend URL: `https://your-frontend-name.onrender.com`
2. Try to log in with your credentials
3. Check if posts are loading
4. Try creating a new post

## Common Issues and Solutions

### Issue 1: Still Getting 400 Error on Login

**Solution**: 
- Double-check that `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` in backend match your exact frontend URL
- Make sure you're using `https://` (not `http://`)
- Clear your browser cache and cookies
- Try in an incognito/private window

### Issue 2: Posts Not Loading

**Possible Causes**:
- Database hasn't been migrated
- No posts exist in the database yet
- CORS is still blocking requests

**Solution**:
1. Check browser console for errors (F12 → Console tab)
2. Look for CORS errors or 403/401 errors
3. Verify database migrations ran successfully
4. Try creating a test post through Django admin:
   - Go to `https://your-backend-name.onrender.com/admin/`
   - Log in with superuser credentials
   - Create a test post

### Issue 3: "Authentication Required" Even When Logged In

**Solution**:
- This is a session cookie issue
- Make sure `SESSION_COOKIE_SECURE=True` in production (already set in the updated settings.py)
- Clear browser cookies and try again
- Make sure both frontend and backend are using HTTPS

### Issue 4: Changes Not Reflected After Redeployment

**Solution**:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Use incognito/private browsing mode
- Check Render deployment logs for any errors

## Verifying Your Configuration

### Check Backend Health:

Visit these URLs in your browser (replace with your actual backend URL):

```
https://your-backend-name.onrender.com/admin/
https://your-backend-name.onrender.com/api/posts/
https://your-backend-name.onrender.com/api/auth/csrf/
```

All should load without errors (posts might be empty if you haven't created any).

### Check Frontend:

1. Open your frontend in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for any errors related to:
   - CORS
   - Authentication
   - API requests

### Check Environment Variables:

In Render Dashboard:
1. Go to your backend service
2. Click "Environment" tab
3. Verify all variables are set correctly
4. Do the same for frontend service

## Quick Reference: What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `ALLOWED_HOSTS` | Tells Django which domains can access it | `your-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | Tells Django which frontend URLs can make API requests | `https://your-frontend.onrender.com` |
| `CSRF_TRUSTED_ORIGINS` | Allows CSRF tokens from specific origins | `https://your-frontend.onrender.com` |
| `REACT_APP_API_URL` | Tells React where the backend API is | `https://your-backend.onrender.com` |
| `DEBUG` | Enables/disables debug mode (MUST be False in production) | `False` |
| `SECRET_KEY` | Django encryption key (must be unique and secret) | `random-string-here` |

## Need More Help?

1. **Check Render Logs**: Go to your service → "Logs" tab to see real-time deployment logs
2. **Check Browser Console**: Open Developer Tools (F12) to see client-side errors
3. **Test API Directly**: Use tools like Postman or curl to test backend endpoints
4. **Django Admin**: Access admin panel to verify database is working

## Example: Finding Your Service URLs

Your backend URL will look like:
```
https://agora-backend-xxxx.onrender.com
```

Your frontend URL will look like:
```
https://agora-frontend-xxxx.onrender.com
```

You can find these exact URLs in your Render dashboard under each service's "Settings" or at the top of each service page.
