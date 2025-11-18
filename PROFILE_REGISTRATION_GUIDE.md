# Quick Start Guide - Profile & Registration

## ✅ Complete - Profile Page + Registration + Email Verification

Your personal profile page is now fully functional with registration enabled!

### Files Created/Modified

**Views** (`backend/core/views.py`)
- ✅ `profile_view()` - Displays user profile with Agora Sparks
- ✅ `register_view()` - Registration form with Yale email validation
- ✅ `email_verification_view()` & `email_verification_confirm_view()` - Email verification flow
- ✅ `_send_verification_email()` - Email sending helper

**Routes** (`backend/core/urls.py`)
```
GET  /profile/                              → Profile page (login-required)
GET  /register/                             → Registration form (public)
POST /register/                             → Form submission
GET  /email-verify/                         → Email verification form
GET  /email-verify-confirm/<uid>/<token>/   → Email confirmation
```

**Templates**
- `profile.html` - Profile page with NetID Verification button
- `register.html` - Registration form with Yale email hint

---

## 🚀 How to Test

### 1. Start the server
```bash
cd backend
python manage.py runserver
```

### 2. Test Registration (No login required)
- Visit: http://localhost:8000/register/
- Try invalid email (e.g., `test@gmail.com`) → Should show error
- Try valid Yale email (e.g., `testuser@yale.edu`) → Should create account

### 3. Create Admin User (Optional)
```bash
cd backend
python manage.py createsuperuser
```
Use credentials like: `admin` / `admin` / `admin@yale.edu`

### 4. Test Profile Page (Login-required)
- Visit: http://localhost:8000/admin/
- Login with your admin credentials
- Visit: http://localhost:8000/profile/
- You should see profile with:
  - Posts: 3
  - Likes: 12
  - Agora Sparks: 33 (level: Spark)
  - Navigation bars including "NetID Verification"
- Click "NetID Verification" bar → Should go to `/register/`

---

## 📋 What's Implemented

### Profile Features
- **Login Required** - Only authenticated users can access
- **Mock Statistics** - Displays posts, likes, Agora Sparks
- **Agora Sparks Level System** - 5 levels (Ember → Aurora)
- **Responsive Design** - Works on mobile and desktop

### Registration Features
- **Yale Email Only** - Must use @yale.edu domain
- **Password Validation** - Confirms password match
- **Email Verification** - Sends verification link to Yale email
- **Clear Error Messages** - Tells user what went wrong
- **Success Feedback** - Shows next steps (check inbox)

### Email Features
- **Auto Email Send** - Registration automatically sends verification
- **Token Based** - Secure token in email link
- **Email Confirmation** - User marks account verified by clicking link
- **Development Mode** - Console backend (prints to terminal)

---

## 🔧 Configuration

**Database**: SQLite (no setup needed)
- File: `backend/db.sqlite3`
- Created automatically on first run

**Email Backend**: Console (for development)
- Emails print to terminal
- To use real email, set `.env`:
  ```
  EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_HOST_USER=your-email@gmail.com
  EMAIL_HOST_PASSWORD=your-app-password
  ```

**Site URL**: Used in email links
- Set in `.env` or defaults to `http://localhost:8000`

---

## 📝 Form Fields

### Registration Form
```
Username      [text input]       → Required, must be unique
Yale Email    [email input]      → Required, must end with @yale.edu
Password      [password input]   → Required
Confirm       [password input]   → Required, must match password
```

---

## ✨ Next Steps

1. **Test locally** - Run server and try the flows above
2. **Try edge cases** - Empty fields, wrong email format, existing username
3. **Check email** - When registration succeeds, check terminal for email output
4. **Verify email link** - Click link in email to test verification flow
5. **Create content** - Add posts/comments to test profile stats

---

## 🐛 Troubleshooting

**"Module not found" error?**
→ Make sure you've activated the virtual environment:
```bash
source ../venv/bin/activate
```

**Database locked?**
→ Delete `db.sqlite3` and let Django recreate it:
```bash
rm backend/db.sqlite3
python manage.py migrate
```

**Email not sending?**
→ Check terminal output (console backend prints there)
→ Settings.py: `EMAIL_BACKEND` should be `django.core.mail.backends.console.EmailBackend`

**Profile page shows 404?**
→ Make sure you're logged in (try `/admin/` first)
→ Routes are: `/profile/` (not `/profile`)

---

## 📚 Architecture

```
REGISTRATION FLOW:
  User visits /register/
      ↓ Shows form
  User enters @yale.edu email
      ↓ Form validation (Python)
  Account created (password hashed)
      ↓
  Verification email generated & sent (HTML + plain text)
      ↓
  Success page shown
      ↓ User clicks email link
  Token validated & account marked verified


PROFILE FLOW:
  User logs in → visits /profile/
      ↓
  Django checks @login_required
      ↓
  Renders profile.html with stats
      ↓
  User sees profile card + navigation bars
      ↓
  User can click "NetID Verification" → goes to /register/
```

---

All done! Your profile page and registration system are ready to use. 🎉
