# Profile Page Implementation Guide

## 🎯 Overview

This document describes the complete implementation of the user profile page for the Agora application, matching the design in your Figma mockup.

## 📁 File Structure

```
/Users/liyiru/mgt656_final_project/
├── backend/
│   ├── core/                          # Django app for profile
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py                  # CustomUser model
│   │   ├── views.py                   # profile_view, profile_api_view, canvas_verify_view
│   │   ├── urls.py                    # URL routing (/profile/, /api/profile/)
│   │   ├── tests.py                   # Unit tests
│   │   └── migrations/
│   │       └── __init__.py
│   │
│   ├── agora_backend/
│   │   ├── settings.py                # Django settings
│   │   ├── settings_local.py          # Local development settings
│   │   ├── urls.py                    # Root URL configuration
│   │   ├── profile.html               # Original profile template
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── agora_frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Profile.jsx        # React Profile component
│   │   │   │   ├── Profile.css        # Profile component styles
│   │   │   │   ├── PostsList.jsx
│   │   │   │   └── PostCard.jsx
│   │   │   ├── api/
│   │   │   │   └── index.js           # API client with axios
│   │   │   ├── App.js                 # Main React app
│   │   │   └── App.css
│   │   └── package.json
│   │
│   ├── manage.py
│   ├── db.sqlite3
│   └── templates/
│       └── profile.html               # Django template (auto-discovered)
│
├── frontend/
│   └── profile/
│       ├── profile.html               # Standalone HTML
│       ├── profile.css                # Standalone CSS
│       └── profile.js                 # Vanilla JavaScript (no framework)
│
└── PROFILE_VERIFICATION.py            # Verification and setup guide script
```

## 🚀 Quick Start

### 1. Backend Setup (Django)

```bash
# Install dependencies
pip install -r requirements.txt

# Run database migrations
cd backend
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

Then visit: **http://localhost:8000/profile/**

### 2. Frontend React Integration

If you want to use the React component in your main app:

```javascript
// In backend/agora_frontend/src/App.js
import React from 'react';
import Profile from './components/Profile';
import './App.css';

function App() {
  return (
    <div className="App">
      <Profile />
    </div>
  );
}

export default App;
```

Then run:
```bash
cd backend/agora_frontend
npm install
npm start
```

### 3. Standalone Frontend (Vanilla JavaScript)

If you want to run the profile as a standalone page:

```bash
cd frontend/profile
python -m http.server 8001
```

Then visit: **http://localhost:8001/profile.html**

## 📋 Features Implemented

### Backend (Django)

**Views:**
- `profile_view()` - Renders the HTML profile page with stats
- `profile_api_view()` - Returns profile data as JSON (for API calls)
- `canvas_verify_view()` - Redirects to Canvas for NetID verification

**URL Routes:**
- `GET /profile/` - Profile page (requires authentication)
- `GET /api/profile/` - Profile API endpoint (requires authentication)
- `GET /canvas/` - Redirect to Canvas

**Models:**
- `CustomUser` - Extended Django User model with bio and avatar fields

**Features:**
- User authentication required (login_required decorator)
- Mock statistics (posts, comments, likes)
- Automatic Agora Sparks score calculation
- User level classification (Ember, Spark, Flame, Blaze, Aurora)

### Frontend (React Component)

**Features:**
- Displays user avatar (placeholder)
- Shows stats: Posts, Likes, Agora Sparks
- Tab navigation (Messages, Notifications)
- Interactive menu items:
  - My posts
  - My comments
  - Agora Sparks
  - NetID Verification (external link)
- Responsive design matching Figma mockup
- Smooth hover animations

### Frontend (Standalone HTML/JS)

**Features:**
- Pure vanilla JavaScript (no framework dependencies)
- Can be served as a static file
- Integrates with Django backend API
- Mock data fallback if API is unavailable
- Event listeners for interactive elements

## 🎨 Design Details

The profile page matches your Figma design with:
- **Container**: 420px max-width, centered, white background, rounded corners
- **Avatar**: 80px circular placeholder (gray #d8d8d8)
- **Stats**: 3 columns (Posts, Likes, Agora Sparks) with border separator
- **Tabs**: Two tab buttons (Messages, Notifications) with active state styling
- **Menu Items**: 4 interactive bars with hover effects (pink background on hover)
- **Colors**:
  - Background: #f5f5f5
  - Container: #ffffff
  - Tab active: #007aff (blue)
  - Hover state: #ffecec (light pink)

## 🔌 API Integration

The profile component can fetch real data from the backend API:

```javascript
// Fetch profile data
const response = await fetch('/api/profile/', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});
const data = await response.json();
// data.stats = { posts: 3, likes: 12, score: 8, ... }
```

## 🔐 Authentication

The profile view requires Django authentication:
- Unauthenticated users are redirected to the login page
- Uses Django's built-in `@login_required` decorator
- Configure `LOGIN_URL` in settings if needed

### Setting up Authentication

```python
# In settings_local.py
LOGIN_REDIRECT_URL = '/profile/'
LOGOUT_REDIRECT_URL = '/profile/'

# Add authentication backends (e.g., Yale CAS)
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'django_cas_ng.backends.CASBackend',  # Yale NetID login
]
```

## 🧪 Testing

Run the included tests:

```bash
cd backend
python manage.py test core.tests
```

## 📝 Next Steps / TODOs

- [ ] Implement real statistics from database
- [ ] Add user avatar upload
- [ ] Create "My posts" page
- [ ] Create "My comments" page
- [ ] Create "Agora Sparks" leaderboard
- [ ] Integrate Canvas NetID verification flow
- [ ] Add API endpoints for posts and comments
- [ ] Set up WebSocket for real-time notifications
- [ ] Add profile editing functionality
- [ ] Implement user bio editing

## 🐛 Troubleshooting

### Profile page shows 404 error
- Ensure you've run `python manage.py migrate`
- Check that `core` app is in `INSTALLED_APPS` in settings.py
- Verify URL patterns in `core/urls.py`

### CSS not loading in Django template
- Make sure you've run `python manage.py collectstatic`
- Check that `STATIC_URL = 'static/'` in settings

### React component not rendering
- Verify that `Profile.jsx` is imported correctly
- Check browser console for errors
- Ensure all dependencies are installed (`npm install`)

### API endpoint returns 401 Unauthorized
- Ensure you're logged in
- Check that Django session is valid
- Verify `@login_required` decorator on views

## 📞 Support

For questions about the implementation, refer to:
- Backend: `backend/core/views.py` and `backend/core/urls.py`
- Frontend: `backend/agora_frontend/src/components/Profile.jsx`
- Standalone: `frontend/profile/profile.html`, `profile.js`, `profile.css`

---

**Created**: November 12, 2025
**Feature Branch**: `feature/10-personal-profile`
**Status**: ✅ Complete and Verified
