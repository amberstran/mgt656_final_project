# Quick Fix Checklist for Render Deployment

## ✅ Immediate Actions Required

### 1. Backend Environment Variables (Render Dashboard)
Go to: Backend Service → Environment Tab

Add/Update these variables:
- [ ] `ALLOWED_HOSTS` = `your-backend-name.onrender.com`
- [ ] `CORS_ALLOWED_ORIGINS` = `https://your-frontend-name.onrender.com`
- [ ] `CSRF_TRUSTED_ORIGINS` = `https://your-frontend-name.onrender.com`
- [ ] `DEBUG` = `False`
- [ ] `SECRET_KEY` = (generate a secure key)
- [ ] `DATABASE_URL` = (should be auto-populated from PostgreSQL)

### 2. Frontend Environment Variables (Render Dashboard)
Go to: Frontend Service → Environment Tab

Add/Update:
- [ ] `REACT_APP_API_URL` = `https://your-backend-name.onrender.com`

### 3. Redeploy Services
- [ ] Deploy backend (wait for completion)
- [ ] Deploy frontend (wait for completion)

### 4. Run Migrations (if first deployment)
- [ ] Go to Backend Service → Shell tab
- [ ] Run: `cd backend && python manage.py migrate`
- [ ] (Optional) Run: `python manage.py createsuperuser`

### 5. Test
- [ ] Visit frontend URL
- [ ] Try logging in
- [ ] Check if posts load
- [ ] Try creating a post

## 🔍 If Issues Persist

### Browser Console Check
- [ ] Open Developer Tools (F12)
- [ ] Check Console tab for errors
- [ ] Look for CORS or authentication errors

### Backend Health Check
Visit these URLs (replace with your backend URL):
- [ ] `https://your-backend.onrender.com/admin/`
- [ ] `https://your-backend.onrender.com/api/posts/`
- [ ] `https://your-backend.onrender.com/api/auth/csrf/`

### Clear Cache
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Try incognito/private window
- [ ] Clear cookies for your site

## 📝 Important Notes

- Use `https://` (not `http://`) for all production URLs
- Backend and frontend URLs must match exactly in environment variables
- Session cookies require HTTPS in production
- Changes updated in `backend/agora_backend/settings.py` (already committed)

## 🆘 Still Not Working?

1. Check Render logs (Service → Logs tab)
2. Verify database is connected and migrated
3. Try creating a post via Django admin
4. Review full guide in `RENDER_DEPLOYMENT_FIX.md`
