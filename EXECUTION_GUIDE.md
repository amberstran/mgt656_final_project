# 🚀 AGORA WEBSITE - EXECUTION GUIDE

## ⚡ THE SIMPLEST WAY TO RUN

### macOS / Linux
```bash
bash START.sh
```

### Windows
```bash
START.bat
```

**That's all you need!** Everything will be set up and started automatically.

---

## 📍 What Happens When You Run It

```
1. Checks system requirements (Python, Node.js, etc)
2. Creates virtual environment
3. Installs all dependencies
4. Initializes database
5. Starts Django backend (port 8000)
6. Starts React frontend (port 3000)
```

---

## 🌐 Access Your Website

Once running:

- **Frontend App:** http://localhost:3000
- **Admin Panel:** http://localhost:8000/admin
- **Profile Page:** http://localhost:3000/profile
- **Email Verify:** http://localhost:3000/email-verify

---

## 🔑 Login to Admin

```
URL:      http://localhost:8000/admin
Username: admin
Password: admin
```

---

## 🎮 Command Options

```bash
# Start everything (default)
bash START.sh
START.bat

# Backend only
bash START.sh backend
START.bat backend

# Frontend only
bash START.sh frontend
START.bat frontend

# Database setup only
bash START.sh db-setup
START.bat db-setup

# Full setup without starting
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

## 🛑 Stop the Website

Press `Ctrl+C` in the terminal where the script is running.

---

## 🐛 Quick Troubleshooting

### Port Already in Use?

**macOS/Linux:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID [PID] /F
```

### Reset Everything?

```bash
bash START.sh clean
bash START.sh
```

### Python/Node Not Installed?

**Python:** https://www.python.org/downloads/
**Node.js:** https://nodejs.org/

---

## 📁 Project Structure (Clean)

```
mgt656_final_project/
├── START.sh               ← Run this (macOS/Linux)
├── START.bat              ← Run this (Windows)
├── README.md              ← Full documentation
├── GETTING_STARTED.md     ← Quick start
├── requirements.txt       ← Python dependencies
├── .env.example           ← Configuration template
│
├── backend/               ← Django backend
│   ├── manage.py
│   ├── core/              ← Main app
│   ├── agora_backend/     ← Django config
│   └── agora_frontend/    ← React frontend
│
├── frontend/              ← Standalone UI (optional)
├── docs/                  ← Detailed documentation
└── venv/                  ← Virtual environment (auto-created)
```

---

## ✨ Features You Get

✅ User Profile with Stats
✅ Email Verification System
✅ Admin Panel
✅ REST API
✅ Agora Sparks Scoring (5 levels)
✅ Responsive Design
✅ Mobile-Friendly

---

## 📊 System Requirements

- Python 3.8+
- Node.js 16+ (optional, for React)
- 500MB disk space
- Modern web browser

---

## 💡 Pro Tips

**Tip 1:** First time setup takes ~2-3 minutes
**Tip 2:** Subsequent runs start in seconds
**Tip 3:** Database persists between runs
**Tip 4:** Admin credentials stay the same

---

## 🎯 Next Steps

1. Run: `bash START.sh`
2. Wait for "Frontend Running" message
3. Open: http://localhost:3000
4. Explore the app!

---

## 📞 Need Help?

- **Full Docs:** See `README.md`
- **Email Setup:** See `docs/guides/EMAIL_VERIFICATION_SETUP.md`
- **More Info:** See `docs/guides/` folder

---

**That's it! You're all set.** 🎉

```bash
bash START.sh
```
