# 🚀 QUICK REFERENCE CARD

## ⚡ Run It Now

```bash
bash START.sh          # macOS/Linux
START.bat              # Windows
```

Then open: **http://localhost:3000**

---

## 🔑 Login

```
Username: admin
Password: admin
```

---

## 📍 URLs

| What | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| Admin | http://localhost:8000/admin |
| Profile | http://localhost:3000/profile |
| Email Verify | http://localhost:3000/email-verify |
| API | http://localhost:8000/api/ |

---

## 🎮 Commands

```bash
bash START.sh           # Start all
bash START.sh backend   # Backend only
bash START.sh frontend  # Frontend only
bash START.sh clean     # Clean up
bash START.sh help      # Show help
```

---

## 🛑 Stop

Press `Ctrl+C`

---

## 🔧 Fix Port Issues

```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
taskkill /PID [PID] /F
```

---

## 📚 Documentation

- `EXECUTION_GUIDE.md` - How to run
- `GETTING_STARTED.md` - Quick start
- `README.md` - Full docs
- `docs/guides/` - Detailed guides

---

**That's all you need!** 🎉
