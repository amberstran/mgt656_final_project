# Render Environment Variables Setup Guide

## Critical: Fix 400 Bad Request Error

After deploying to Render, you **MUST** set these environment variables for the app to work:

### Backend Service (`agora-backend`)

1. **SECRET_KEY** (should be auto-generated, but verify it exists)
   - Generate if needed: `python -c "import secrets; print(secrets.token_urlsafe(50))"`

2. **DEBUG**: `False`

3. **ALLOWED_HOSTS**: `your-backend-name.onrender.com`
   - Replace with your actual backend service URL
   - Example: `agora-backend.onrender.com`

4. **CORS_ALLOWED_ORIGINS**: `https://your-frontend-name.onrender.com`
   - Replace with your actual frontend service URL
   - Example: `https://agora-frontend.onrender.com`
   - **IMPORTANT**: Must use `https://` not `http://`

5. **CSRF_TRUSTED_ORIGINS**: `https://your-frontend-name.onrender.com`
   - Same as CORS_ALLOWED_ORIGINS
   - Example: `https://agora-frontend.onrender.com`
   - **IMPORTANT**: Must use `https://` not `http://`

6. **DATABASE_URL**: Automatically set by Render (from database connection)

### Frontend Service (`agora-frontend`)

1. **REACT_APP_API_URL**: `https://your-backend-name.onrender.com`
   - Replace with your actual backend service URL
   - Example: `https://agora-backend.onrender.com`
   - **IMPORTANT**: 
     - Must use `https://` not `http://`
     - Do NOT include `/api/` at the end (the code adds it automatically)
     - Must match exactly what you set in backend's ALLOWED_HOSTS

## Step-by-Step Setup

### 1. Deploy Both Services First

Deploy your Blueprint first to get the service URLs.

### 2. Get Your Service URLs

After deployment, you'll see URLs like:
- Backend: `https://agora-backend-xxxx.onrender.com`
- Frontend: `https://agora-frontend-xxxx.onrender.com`

### 3. Set Backend Environment Variables

1. Go to your **Backend Service** in Render dashboard
2. Click on **Environment** tab
3. Add/Update these variables:

```
ALLOWED_HOSTS=agora-backend-vavf.onrender.com
CORS_ALLOWED_ORIGINS=https://agora-frontend-16kz.onrender.com
CSRF_TRUSTED_ORIGINS=https://agora-frontend-16kz.onrender.com
```

4. Click **Save Changes**
5. The service will automatically redeploy

### 4. Set Frontend Environment Variable

1. Go to your **Frontend Service** in Render dashboard
2. Click on **Environment** tab
3. Add this variable:

```
REACT_APP_API_URL=https://agora-backend-vavf.onrender.com
```

4. Click **Save Changes**
5. The service will automatically rebuild and redeploy

### 5. Verify the Setup

1. Check backend logs - should show no CORS errors
2. Check frontend - should be able to load posts
3. Test in browser console - check Network tab for API calls
4. Visit `https://agora-backend-vavf.onrender.com/api/auth/health/` to verify cookie flags and trusted origins

## Common Issues

### 400 Bad Request Error

**Cause**: CORS or CSRF configuration mismatch

**Fix**:
1. Verify `CORS_ALLOWED_ORIGINS` in backend matches frontend URL exactly
2. Verify `CSRF_TRUSTED_ORIGINS` in backend matches frontend URL exactly
3. Verify `REACT_APP_API_URL` in frontend matches backend URL exactly
4. Make sure all URLs use `https://` not `http://`
5. Redeploy both services after setting variables
 6. Ensure backend `ALLOWED_HOSTS` includes the exact backend hostname (e.g., `agora-backend-vavf.onrender.com`); missing host causes immediate 400 (DisallowedHost)

### CORS Error in Browser Console

**Cause**: Backend not allowing frontend origin

**Fix**:
1. Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
2. Make sure there are no trailing slashes
3. Verify the URL matches exactly (case-sensitive)

### API Calls Going to Wrong URL

**Cause**: `REACT_APP_API_URL` not set or incorrect

**Fix**:
1. Verify `REACT_APP_API_URL` is set in frontend environment
2. Check browser console - the API calls should show the correct URL
3. The URL should be `https://your-backend.onrender.com` (without `/api/`)

## Quick Checklist

- [ ] Backend `ALLOWED_HOSTS` set to backend URL
- [ ] Backend `CORS_ALLOWED_ORIGINS` set to frontend URL (https://)
- [ ] Backend `CSRF_TRUSTED_ORIGINS` set to frontend URL (https://)
- [ ] Frontend `REACT_APP_API_URL` set to backend URL (https://)
- [ ] All URLs use `https://` not `http://`
- [ ] Both services redeployed after setting variables
- [ ] Checked browser console for errors
- [ ] Checked backend logs for errors

## Testing

After setting all variables:

1. Open your frontend URL in browser
2. Open browser DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Look for requests to `/api/posts/`
6. Check if they return 200 OK or show errors

If you still see 400 errors, check:
- Backend logs for detailed error messages
- Browser console for CORS errors
- Network tab for request/response details

