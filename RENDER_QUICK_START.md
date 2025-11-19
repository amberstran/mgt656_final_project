# Quick Start: Deploy to Render

## Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **In Render Dashboard:**
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will auto-detect `render.yaml`

3. **Set Environment Variables:**
   
   **Backend Service:**
   - `SECRET_KEY`: Generate with: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `your-backend-name.onrender.com` (after deployment)
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-name.onrender.com` (after frontend deploys)
   - `CSRF_TRUSTED_ORIGINS`: `https://your-frontend-name.onrender.com` (after frontend deploys)
   
   **Frontend Service:**
   - `REACT_APP_API_URL`: `https://your-backend-name.onrender.com`

4. **After deployment, run migrations:**
   - Go to backend service → Shell
   - Run: `cd backend && python manage.py migrate`

## Option 2: Manual Setup

See `DEPLOYMENT.md` for detailed step-by-step instructions.

## Important Notes

- Free tier services spin down after 15 min of inactivity
- First request after spin-down takes 30-60 seconds
- Update CORS/CSRF settings after both services are deployed
- Database URL is automatically set by Render

## Testing Locally with Production Settings

To test with production-like settings locally:

```bash
export SECRET_KEY="your-secret-key"
export DEBUG="False"
export DATABASE_URL="your-database-url"
export ALLOWED_HOSTS="localhost,127.0.0.1"
export CORS_ALLOWED_ORIGINS="http://localhost:3000"
export CSRF_TRUSTED_ORIGINS="http://localhost:3000"
```

