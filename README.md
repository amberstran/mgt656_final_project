# 🚀 Agora Yale - Complete Setup & Deployment Guide

Welcome to **Agora**, a community discussion platform built for Yale University.

## ⚡ Quick Start (30 seconds)

### macOS / Linux
```bash
bash START.sh
```

### Windows
```bash
START.bat
```

That's it! The application will:
- ✅ Setup Python virtual environment
- ✅ Install all dependencies
- ✅ Configure database
- ✅ Start Django backend (port 8000)
- ✅ Start React frontend (port 3000)

Then visit: **http://localhost:3000**

---

## 📋 What's Included

### Backend (Django)
- ✅ User authentication
- ✅ User profile with Agora Sparks system
- ✅ Email-based NetID verification
- ✅ Profile statistics and user levels
- ✅ REST API endpoints
- ✅ Admin panel

### Frontend (React)
- ✅ User profile page
- ✅ Email verification form
- ✅ Responsive design
- ✅ Real-time data from API

### Features
- ✅ Yale email verification (@yale.edu only)
- ✅ Token-based email confirmation
- ✅ Agora Sparks scoring system (5 levels)
- ✅ Profile statistics
- ✅ Professional UI

---

## 🛠️ Setup Options

### Option 1: Full Startup (Both Services)
```bash
bash START.sh          # macOS/Linux
START.bat              # Windows
```
Starts backend (port 8000) and frontend (port 3000) simultaneously.

### Option 2: Backend Only
```bash
bash START.sh backend          # macOS/Linux
START.bat backend              # Windows
```
Only Django backend. Access admin at: http://localhost:8000/admin

### Option 3: Frontend Only
```bash
bash START.sh frontend         # macOS/Linux
START.bat frontend             # Windows
```
Only React app. Requires backend running separately.

### Option 4: Database Setup Only
```bash
bash START.sh db-setup         # macOS/Linux
START.bat db-setup             # Windows
```
Initialize database and create admin user.

### Option 5: Full Setup Without Starting
```bash
bash START.sh setup            # macOS/Linux
START.bat setup                # Windows
```
Setup everything but don't start services.

---

## 📍 URLs & Endpoints

### Frontend
- 🌐 **Main App:** http://localhost:3000
- 👤 **Profile:** http://localhost:3000/profile
- ✉️ **Email Verify:** http://localhost:3000/email-verify

### Backend (Django)
- 🏠 **Homepage:** http://localhost:8000
- 🎯 **Profile:** http://localhost:8000/profile/
- ✉️ **Email Verify:** http://localhost:8000/email-verify/
- 📊 **API Profile:** http://localhost:8000/api/profile/
- 📧 **API Email:** http://localhost:8000/api/email-verify/
- 🔧 **Admin Panel:** http://localhost:8000/admin/

---

## 🔑 Default Credentials

**Admin Account:**
- 👤 Username: `admin`
- 🔐 Password: `admin`

Login at: http://localhost:8000/admin

---

## ⚙️ Configuration

### Email Settings

Email verification requires configuration. See `.env.example` for options:

#### Development (Print to Console)
```
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```
Emails will print to Django console - perfect for testing!

#### Production (Gmail SMTP)
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Use app password in `.env`

See `EMAIL_VERIFICATION_SETUP.md` for more providers (SendGrid, AWS SES, etc.)

### Database

**Development:** SQLite (auto-created)
**Production:** PostgreSQL (configure in `.env`)

---

## 📁 Project Structure

```
mgt656_final_project/
├── backend/                          # Django project
│   ├── manage.py                     # Django CLI
│   ├── db.sqlite3                    # Development database
│   ├── agora_backend/                # Main Django app
│   │   ├── settings.py               # Configuration
│   │   ├── urls.py                   # URL routing
│   │   └── templates/                # HTML templates
│   ├── agora_frontend/               # React app
│   │   ├── package.json              # React dependencies
│   │   ├── public/                   # Static files
│   │   └── src/                      # React components
│   └── core/                         # Core app
│       ├── models.py                 # Database models
│       ├── views.py                  # View logic
│       ├── urls.py                   # App URLs
│       └── admin.py                  # Admin config
├── frontend/                         # Standalone frontend
├── requirements.txt                  # Python dependencies
├── .env.example                      # Environment template
├── START.sh                          # macOS/Linux startup
├── START.bat                         # Windows startup
└── README.md                         # This file
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Port 8000 (Django):**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID [PID] /F
```

**Port 3000 (React):**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Python Not Found

Install Python 3.8+:
- macOS: `brew install python3`
- Linux: `sudo apt-get install python3 python3-pip`
- Windows: https://www.python.org/downloads/

### Node.js Not Found

Install Node.js:
- https://nodejs.org/ (LTS recommended)

### Database Issues

Reset database:
```bash
# macOS/Linux
rm backend/db.sqlite3
bash START.sh db-setup

# Windows
del backend\db.sqlite3
START.bat db-setup
```

### Email Not Sending

1. Check `.env` file exists and is configured
2. For Gmail, verify app-specific password is set
3. Check port 587 is not blocked by firewall
4. Review Django logs in console output

### React Not Loading

1. Ensure backend is running (Django server on port 8000)
2. Check React dependencies installed: `npm install`
3. Try clearing cache: `bash START.sh clean`

### CORS or API Errors

Ensure backend is running. React connects to:
```
http://localhost:8000/api/profile/
http://localhost:8000/api/email-verify/
```

---

## 📚 Documentation

### Core Features
- **`PROFILE_IMPLEMENTATION_GUIDE.md`** - User profile system
- **`README_PROFILE.md`** - Profile feature overview
- **`NETID_EMAIL_VERIFICATION.md`** - Email verification details

### Email Configuration
- **`EMAIL_VERIFICATION_SETUP.md`** - Complete email setup guide (9+ providers)
- **`EMAIL_VERIFICATION_QUICK_START.md`** - Quick reference
- **`EMAIL_VERIFICATION_IMPLEMENTATION.md`** - Implementation details

### Setup & Deployment
- **`POSTGRESQL_SETUP.md`** - PostgreSQL configuration
- **`QUICK_REFERENCE.md`** - Command reference
- **`.env.example`** - Environment variables template

---

## 🧪 Testing

### Manual Testing

1. **Access the app:**
   ```
   http://localhost:3000
   ```

2. **Login to admin:**
   ```
   http://localhost:8000/admin
   Username: admin
   Password: admin
   ```

3. **Test profile page:**
   ```
   http://localhost:3000/profile
   or
   http://localhost:8000/profile/
   ```

4. **Test email verification:**
   - Visit http://localhost:8000/email-verify/
   - Submit email: testuser@yale.edu
   - Check Django console for verification link
   - Click link to confirm

### Django Shell

```bash
cd backend
python manage.py shell
```

```python
# List users
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.all()

# Check verification status
user = User.objects.get(username='admin')
print(user.email, user.is_verified)

# Create test user
User.objects.create_user(
    username='testuser',
    email='testuser@yale.edu',
    password='testpass123'
)
```

---

## 🚀 Deployment

### Heroku / Cloud Platforms

1. **Set environment variables:**
   ```
   SITE_URL=https://your-domain.com
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   SECRET_KEY=your-secure-secret-key
   DEBUG=False
   DATABASE_URL=postgresql://...
   ```

2. **Deploy:**
   - Push to repository
   - Platform builds and runs

3. **Verify:**
   - Test all endpoints
   - Check email sending
   - Review logs

### Docker

```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "agora_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```bash
docker build -t agora .
docker run -p 8000:8000 agora
```

---

## 📊 Architecture

```
┌─────────────────────┐
│   React Frontend    │
│ (http://localhost:3000)
└──────────┬──────────┘
           │
           ▼ API Calls
┌─────────────────────┐       ┌──────────────┐
│  Django Backend     │◄─────►│   Database   │
│ (http://localhost:8000)     │   SQLite     │
└──────────┬──────────┘       └──────────────┘
           │
           ▼ Email
    ┌─────────────┐
    │ SMTP Server │
    │  (Gmail)    │
    └─────────────┘
```

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Set `SECRET_KEY` in production
- [ ] Set `DEBUG = False` in production
- [ ] Enable HTTPS
- [ ] Configure allowed hosts
- [ ] Use strong email credentials
- [ ] Set up database backups
- [ ] Monitor email delivery
- [ ] Review user access logs

---

## 🤝 Support

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process on that port (see Troubleshooting) |
| Python/Node not found | Install from official websites |
| Database error | Reset database and re-initialize |
| Email not sending | Check `.env` configuration |
| CORS error | Ensure both servers running |
| React won't load | Check backend is running |

### Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Django Email Guide](https://docs.djangoproject.com/en/5.2/topics/email/)
- [Django Security](https://docs.djangoproject.com/en/5.2/topics/security/)

---

## 📋 Commands Reference

### Django
```bash
cd backend
python manage.py runserver           # Start development server
python manage.py shell               # Interactive Python shell
python manage.py migrate             # Run database migrations
python manage.py createsuperuser     # Create admin user
python manage.py collectstatic       # Collect static files
python manage.py test                # Run tests
```

### React
```bash
cd backend/agora_frontend
npm start                            # Development server
npm run build                        # Production build
npm install                          # Install dependencies
npm test                             # Run tests
```

### Cleanup
```bash
bash START.sh clean                  # Clean all temp files
rm backend/db.sqlite3                # Delete database
rm -rf backend/agora_frontend/node_modules  # Delete npm deps
```

---

## 📞 Contact & Support

For issues or questions:
1. Check documentation files
2. Review error messages in console
3. Check application logs
4. Consult Django/React documentation

---

## 📝 Version Info

- **Django:** 5.2.8
- **Django REST Framework:** 3.16.1
- **React:** 18.x
- **Node:** 16.x+
- **Python:** 3.8+
- **Database:** SQLite (dev) / PostgreSQL (prod)

---

## ✅ Quick Checklist

- [x] Profile page implemented
- [x] Email verification system
- [x] Yale email validation
- [x] Admin panel
- [x] API endpoints
- [x] React frontend
- [x] Agora Sparks scoring
- [x] Token-based verification
- [x] HTML email templates
- [x] Complete documentation

---

**Ready to go!** 🎉

Start the application with:
```bash
bash START.sh    # macOS/Linux
START.bat        # Windows
```

Then visit: **http://localhost:3000**

---

*Last Updated: 2025-11-12*
*Agora - Yale Community Discussion Platform*
