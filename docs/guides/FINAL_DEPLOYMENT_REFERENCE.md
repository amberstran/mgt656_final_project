# 📋 Agora Yale - Final Deployment Reference

## 🎯 Overview

This document provides the final reference for deploying and running the complete Agora Yale application.

---

## ⚡ 30-Second Quick Start

### macOS / Linux
```bash
bash START.sh
```

### Windows
```bash
START.bat
```

**That's it!** Your application will be running at:
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:8000
- 🔐 Admin: http://localhost:8000/admin

---

## 📦 Complete Startup Script Usage

### Syntax
```bash
bash START.sh [option]      # macOS/Linux
START.bat [option]          # Windows
```

### Available Options

| Option | Description | Ports |
|--------|-------------|-------|
| `start` | Start both backend & frontend (default) | 8000, 3000 |
| `backend` | Django backend only | 8000 |
| `frontend` | React frontend only | 3000 |
| `db-setup` | Initialize database only | N/A |
| `setup` | Full setup without starting | N/A |
| `clean` | Remove temporary files | N/A |
| `help` | Show help message | N/A |

### Examples

```bash
# Full startup (both services)
bash START.sh
START.bat

# Backend only
bash START.sh backend
START.bat backend

# Frontend only (requires backend running)
bash START.sh frontend
START.bat frontend

# Setup database
bash START.sh db-setup
START.bat db-setup

# Full setup (install, migrate, etc)
bash START.sh setup
START.bat setup

# Clean temporary files
bash START.sh clean
START.bat clean

# Show help
bash START.sh help
START.bat help
```

---

## 🌐 Application URLs

### Frontend (React)
```
http://localhost:3000                 Main App
http://localhost:3000/profile         User Profile
http://localhost:3000/email-verify    Email Verification
```

### Backend (Django)
```
http://localhost:8000                 Django Home
http://localhost:8000/profile/        User Profile (Template)
http://localhost:8000/email-verify/   Email Verification Form
http://localhost:8000/admin/          Admin Panel
```

### API Endpoints
```
http://localhost:8000/api/profile/               GET user stats
http://localhost:8000/api/email-verify/          POST verify email
http://localhost:8000/email-verify-confirm/      Confirmation link
```

---

## 🔑 Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin`
- **Email:** `admin@example.com`

Access at: http://localhost:8000/admin

---

## 📊 Ports & Services

| Service | Port | URL | Technology |
|---------|------|-----|-----------|
| Frontend | 3000 | http://localhost:3000 | React |
| Backend | 8000 | http://localhost:8000 | Django |
| Database | 5432 | localhost:5432 | PostgreSQL (optional) |
| SMTP | 587 | N/A | Email service |

---

## ⚙️ Configuration Files

### `.env` - Environment Variables
```bash
# Copy from template
cp .env.example .env

# Edit for your settings
SITE_URL=http://localhost:8000
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

See `EMAIL_VERIFICATION_SETUP.md` for full email configuration.

### `settings.py` - Django Configuration
Located at: `backend/agora_backend/settings.py`
- Database configuration
- Email settings
- Security settings
- Authentication backends

### `package.json` - React Dependencies
Located at: `backend/agora_frontend/package.json`
- React libraries
- Build tools
- Development dependencies

---

## 🚀 Startup Process (What START Script Does)

```
1. Check Requirements
   ├─ Python 3.x
   ├─ Node.js (optional)
   └─ PostgreSQL (optional)

2. Setup Environment
   ├─ Create virtual environment
   ├─ Activate venv
   └─ Install dependencies

3. Configure Application
   ├─ Create .env file
   ├─ Load environment variables
   └─ Set up settings

4. Initialize Database
   ├─ Run migrations
   ├─ Create tables
   └─ Create admin user

5. Start Services
   ├─ Start Django backend (port 8000)
   └─ Start React frontend (port 3000)
```

---

## 🧪 Testing Endpoints

### Test Profile API
```bash
curl http://localhost:8000/api/profile/
```

Response:
```json
{
  "stats": {
    "posts": 3,
    "comments": 4,
    "likes": 10,
    "score": 28,
    "level_name": "Spark",
    "level_hint": "You're lighting up the space with ideas."
  }
}
```

### Test Email Verification API
```bash
curl -X POST http://localhost:8000/api/email-verify/ \
  -H "Content-Type: application/json" \
  -d '{"email": "student@yale.edu"}'
```

Response:
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox.",
  "email": "student@yale.edu",
  "verified": false
}
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Port 8000:**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID [PID] /F
```

**Port 3000:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Issue: Python Not Found

**macOS:**
```bash
brew install python3
```

**Linux:**
```bash
sudo apt-get install python3 python3-pip
```

**Windows:**
- Download from https://www.python.org/downloads/
- Add Python to PATH during installation

### Issue: Node.js Not Found

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
sudo apt-get install nodejs npm
```

**Windows:**
- Download from https://nodejs.org/
- Install LTS version

### Issue: Database Error

**Reset database:**
```bash
# macOS/Linux
rm backend/db.sqlite3
bash START.sh db-setup

# Windows
del backend\db.sqlite3
START.bat db-setup
```

### Issue: Email Not Sending

1. Check `.env` is configured correctly
2. For Gmail, use app-specific password
3. Check port 587 is not blocked
4. Review Django console output

### Issue: React Won't Connect

1. Verify backend is running on port 8000
2. Check browser console for CORS errors
3. Verify React dependencies: `npm install`
4. Clear cache: `npm cache clean --force`

---

## 📈 Features & Components

### Backend Features
- ✅ User authentication
- ✅ Profile management
- ✅ Email verification
- ✅ Agora Sparks scoring
- ✅ Admin panel
- ✅ REST API

### Frontend Features
- ✅ Responsive UI
- ✅ Profile display
- ✅ Email verification form
- ✅ Real-time API integration
- ✅ Mobile-friendly design

### Agora Sparks System
```
Ember   (0-19)   - A faint ember, journey begins
Spark   (20-39)  - Lighting up the space
Flame   (40-69)  - Energy felt across community
Blaze   (70-94)  - Driving discussions
Aurora  (95+)    - Rare light inspiring others
```

**Score Calculation:**
- Posts: 5 points each
- Comments: 2 points each
- Likes: 1 point each

---

## 📚 Documentation Files

### Core Documentation
| File | Purpose |
|------|---------|
| `README.md` | Main overview and quick start |
| `START.sh` / `START.bat` | Startup scripts |
| `QUICK_REFERENCE.md` | Command reference |

### Feature Documentation
| File | Purpose |
|------|---------|
| `PROFILE_IMPLEMENTATION_GUIDE.md` | Profile system details |
| `README_PROFILE.md` | Profile feature overview |
| `NETID_EMAIL_VERIFICATION.md` | Email verification details |

### Configuration Documentation
| File | Purpose |
|------|---------|
| `EMAIL_VERIFICATION_SETUP.md` | Email provider setup (9+ options) |
| `EMAIL_VERIFICATION_QUICK_START.md` | Quick email reference |
| `EMAIL_VERIFICATION_IMPLEMENTATION.md` | Implementation details |
| `POSTGRESQL_SETUP.md` | Database configuration |

### Configuration Files
| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `requirements.txt` | Python dependencies |
| `backend/agora_frontend/package.json` | React dependencies |

---

## 🔄 Common Workflows

### Workflow 1: Development (Local Testing)
```bash
# 1. Start everything
bash START.sh

# 2. Access frontend
open http://localhost:3000

# 3. Access admin
open http://localhost:8000/admin

# 4. Stop: Ctrl+C in each terminal
```

### Workflow 2: Backend Only Development
```bash
# 1. Start backend
bash START.sh backend

# 2. Test API with curl
curl http://localhost:8000/api/profile/

# 3. Access admin
open http://localhost:8000/admin

# 4. Stop: Ctrl+C
```

### Workflow 3: Debug Email
```bash
# 1. Ensure .env has console backend
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# 2. Start backend
bash START.sh backend

# 3. Submit email at http://localhost:8000/email-verify/

# 4. Check Django console output for email content

# 5. Copy verification link and visit in browser
```

### Workflow 4: Reset Everything
```bash
# Clean all temporary files
bash START.sh clean

# Remove database
rm backend/db.sqlite3

# Full fresh start
bash START.sh setup
bash START.sh
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | 50+ |
| Python Files | 15+ |
| React Components | 5+ |
| HTML Templates | 5+ |
| Documentation Files | 12+ |
| API Endpoints | 5+ |
| Database Models | 1 |
| User Levels | 5 |

---

## 🔐 Production Checklist

- [ ] Change admin password
- [ ] Set `SECRET_KEY` to random secure value
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Setup HTTPS/SSL
- [ ] Configure email provider
- [ ] Setup database backups
- [ ] Configure logging
- [ ] Setup error monitoring
- [ ] Review security settings
- [ ] Test all endpoints
- [ ] Setup monitoring/alerts

See `EMAIL_VERIFICATION_SETUP.md` for production email configuration.

---

## 🚀 Deployment Options

### Local Development
```bash
bash START.sh
```

### Docker
```bash
docker build -t agora .
docker run -p 8000:8000 -p 3000:3000 agora
```

### Heroku
```bash
git push heroku main
```

### AWS / Azure / Google Cloud
- Set environment variables
- Configure database
- Deploy container or app
- Setup domain/SSL

---

## 📞 Support

### Resources
- [Django Docs](https://docs.djangoproject.com/)
- [React Docs](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Common Commands

```bash
# Python/Django
python manage.py shell              # Interactive shell
python manage.py migrate            # Run migrations
python manage.py createsuperuser    # Create admin
python manage.py runserver          # Start server

# React/Node
npm install                         # Install dependencies
npm start                          # Development server
npm run build                      # Production build
npm test                           # Run tests

# Utilities
bash START.sh help                 # Show help
bash START.sh clean                # Clean files
```

---

## ✅ Final Checklist

Before going live:
- [ ] ✅ All features working locally
- [ ] ✅ Email verification tested
- [ ] ✅ Profile page displaying correctly
- [ ] ✅ Admin panel accessible
- [ ] ✅ All API endpoints working
- [ ] ✅ Database configured
- [ ] ✅ Environment variables set
- [ ] ✅ Security settings reviewed
- [ ] ✅ Documentation read and understood
- [ ] ✅ Ready to deploy!

---

## 🎉 Ready to Launch!

Your Agora Yale application is ready to deploy.

**To start:**
```bash
bash START.sh
```

**Then visit:**
```
http://localhost:3000
```

---

*Last Updated: 2025-11-12*
*Agora Yale - Yale Community Discussion Platform*
*Version: 1.0*
