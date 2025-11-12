# Deployment Guide for Render

This guide will help you deploy the Agora application to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Create PostgreSQL Database

1. In your Render dashboard, click "New +" → "PostgreSQL"
2. Name it `agora-db` (or any name you prefer)
3. Select the free plan
4. Note the **Internal Database URL** - you'll need this later

### 2. Deploy Backend (Django API)

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your repository
3. Configure the service:
   - **Name**: `agora-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && cd backend && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     cd backend && gunicorn agora_backend.wsgi:application --bind 0.0.0.0:$PORT
     ```
   - **Root Directory**: Leave empty (or set to project root)

4. Add Environment Variables:
   - `SECRET_KEY`: Generate a secure random string (you can use: `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
   - `DEBUG`: `False`
   - `DATABASE_URL`: Use the Internal Database URL from step 1
   - `ALLOWED_HOSTS`: `your-backend-service.onrender.com` (you'll get this after deployment)
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-service.onrender.com` (you'll update this after frontend deployment)
   - `CSRF_TRUSTED_ORIGINS`: `https://your-frontend-service.onrender.com` (you'll update this after frontend deployment)

5. Click "Create Web Service"

### 3. Deploy Frontend (React App)

1. In Render dashboard, click "New +" → "Static Site" (or "Web Service" if using serve)
2. Connect your repository
3. Configure the service:
   - **Name**: `agora-frontend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd backend/agora_frontend && npm install && npm run build
     ```
   - **Publish Directory**: `backend/agora_frontend/build`
   - **Root Directory**: Leave empty

4. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://your-backend-service.onrender.com` (the URL from your backend service)

5. Click "Create Static Site"

### 4. Update Backend Environment Variables

After both services are deployed:

1. Go to your backend service settings
2. Update these environment variables:
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-service.onrender.com`
   - `CSRF_TRUSTED_ORIGINS`: `https://your-frontend-service.onrender.com`
   - `ALLOWED_HOSTS`: `your-backend-service.onrender.com`

3. Save and redeploy if needed

### 5. Run Database Migrations

1. In your backend service, go to "Shell" tab
2. Run:
   ```bash
   cd backend
   python manage.py migrate
   ```

### 6. Create Superuser (Optional)

To access Django admin:

1. In your backend service, go to "Shell" tab
2. Run:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

## Using render.yaml (Alternative Method)

If you prefer using the `render.yaml` file:

1. Push your code with `render.yaml` to your repository
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use `render.yaml`
5. You'll still need to set environment variables manually:
   - `SECRET_KEY` (generate a secure key)
   - `CORS_ALLOWED_ORIGINS` (set after frontend is deployed)
   - `CSRF_TRUSTED_ORIGINS` (set after frontend is deployed)
   - `ALLOWED_HOSTS` (set after backend is deployed)

## Environment Variables Summary

### Backend Service
- `SECRET_KEY`: Django secret key (required)
- `DEBUG`: `False` for production
- `DATABASE_URL`: Automatically set if using Render PostgreSQL
- `ALLOWED_HOSTS`: Your backend service URL
- `CORS_ALLOWED_ORIGINS`: Your frontend service URL
- `CSRF_TRUSTED_ORIGINS`: Your frontend service URL

### Frontend Service
- `REACT_APP_API_URL`: Your backend service URL (e.g., `https://agora-backend.onrender.com`)

## Troubleshooting

### Backend Issues

1. **Database Connection Error**: 
   - Verify `DATABASE_URL` is set correctly
   - Check that the database is in the same region as your service

2. **Static Files Not Loading**:
   - Ensure `collectstatic` runs in build command
   - Check `STATIC_ROOT` and `STATIC_URL` in settings.py

3. **CORS Errors**:
   - Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
   - Check that URLs use `https://` not `http://`

### Frontend Issues

1. **API Connection Errors**:
   - Verify `REACT_APP_API_URL` is set correctly
   - Check that the backend URL is accessible
   - Ensure CORS is configured on backend

2. **Build Failures**:
   - Check Node version compatibility
   - Verify all dependencies are in `package.json`

## Post-Deployment Checklist

- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Database migrations completed
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Frontend can connect to backend API
- [ ] Test login functionality
- [ ] Test creating/viewing posts
- [ ] Test like/comment functionality

## Notes

- Free tier services on Render spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for always-on services
- Database backups are recommended for production use

