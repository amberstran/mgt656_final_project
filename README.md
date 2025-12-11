# 📋 **MGT656 Final Project – Comprehensive Report**

**Project:** Agora Yale – Community Discussion Platform <br>
**Team:** Amber Tran, Ameesha Masand, Yiru Li

---

# 🧠 **1. Project Description & Problem Being Solved**

### 📘 Project Description

Agora is a lightweight, community-centered discussion platform built specifically for Yale graduate and professional students. Its purpose is to offer one unified, welcoming digital space where students can share experiences, ask questions, and connect beyond the boundaries of their individual schools or programs.

Today, student communication is spread across numerous channels—GroupMe, WeChat, WhatsApp, and program-specific mailing lists. These platforms function independently, creating isolated pockets of information that are difficult to search and nearly impossible to navigate collectively. Agora addresses this fragmentation by consolidating conversations into a single platform designed for simplicity and accessibility.

The system allows users to create posts, upload images, participate in comment threads, and browse topics shared by peers across the graduate community. Registration is intentionally restricted to Yale graduate students through a simple `@yale.edu` email check, ensuring a focused and relevant environment for campus-specific discussions.

At its core, Agora is designed to foster a stronger sense of belonging and help students naturally form their own circles within Yale’s diverse academic landscape. By creating a central space for dialogue and connection, the platform supports the everyday interactions that shape student community life. 

🪐 This vision also highlights a broader challenge: Yale graduate students currently lack a unified, accessible environment for campus-wide communication — a gap that Agora aims to address.

## 💡 Solution: Agora Yale

**Agora** is a lightweight, Yale-focused discussion platform designed to centralize student conversations in a clean, searchable environment.

It allows students to:

* 📝 **Create posts**, including **image uploads**
* 💬 **Comment** on posts
* 👤 **Register using Yale email addresses** (simple `@yale.edu` check)
* 📄 **View basic user profiles**
* 🎨 **Browse a unified, clean UI** with consistent styling
* 🔁 **Interact with an A/B test variation page** created for experimentation



# 🚀 **2. Setup Instructions (Local Development)**

## 🖥️ Prerequisites

* Python 3.9+
* Node.js 16+
* npm or yarn
* Git

---

## ⚡ Option 1 — Automated Setup (Recommended)

### macOS / Linux

```bash
cd mgt656_final_project/mgt656_final_project
bash START.sh
```

### Windows

```bash
cd mgt656_final_project\mgt656_final_project
START.bat
```

This script:

* Creates virtual environment
* Installs Python and Node dependencies
* Initializes SQLite database
* Starts Django backend (8000)
* Starts React frontend (3000)

Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔧 Option 2 — Manual Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate        # Windows

pip install -r ../requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

---

## 🎨 Manual Frontend Setup

```bash
cd backend/agora_frontend
npm install
npm start
```

---

## 🌐 Local URLs

| Component     | URL                                                              |
| ------------- | ---------------------------------------------------------------- |
| Frontend      | [http://localhost:3000](http://localhost:3000)                   |
| Backend       | [http://localhost:8000](http://localhost:8000)                   |
| Admin Panel   | [http://localhost:8000/admin](http://localhost:8000/admin)       |
| A/B Test Page | [http://localhost:8000/1317cca/](http://localhost:8000/1317cca/) |

---

# 🌍 **3. Deployment Information**

## Platform: **Render**

Render hosts both frontend and backend with auto-deploy from GitHub.

### Deployment Targets

| Layer            | URL                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------- |
| Frontend (React) | [https://agora-frontend-16kz.onrender.com/](https://agora-frontend-16kz.onrender.com/) |
| Backend (Django) | [https://agora-backend-vavf.onrender.com/](https://agora-backend-vavf.onrender.com/)   |

---

## 🧪 Staging Environment

Same as production for this course project; automatically deployed on pushes to `main`.

---

## 🚀 Backend Deployment Steps (Render)

1. Create Web Service → connect GitHub repo
2. Set build command:

   ```bash
   pip install -r requirements.txt
   ```
3. Set start command:

   ```bash
   cd backend && gunicorn agora_backend.wsgi:application --bind 0.0.0.0:$PORT
   ```
4. Set environment variables:

   ```
   DEBUG=False
   SECRET_KEY=xxx
   ALLOWED_HOSTS=agora-backend-vavf.onrender.com
   CORS_ALLOWED_ORIGINS=https://agora-frontend-16kz.onrender.com
   ```

---

## 🎨 Frontend Deployment Steps (Render)

1. New Static Site → connect repo
2. Build command:

   ```bash
   cd backend/agora_frontend && npm install && npm run build
   ```
3. Publish directory:

   ```
   backend/agora_frontend/build
   ```
4. Environment variables:

   ```
   REACT_APP_API_URL=https://agora-backend-vavf.onrender.com
   ```

---

# 🛠️ **4. Technology Stack**

## Backend

* Django 5
* Django REST Framework
* Python 3.9+
* SQLite (dev) / PostgreSQL (deployment ready)
* django-cors-headers
* Gunicorn

## Frontend

* React 18
* React Router
* Axios
* CSS

## DevOps

* Render
* GitHub
* START scripts for local setup

---

# 👥 **5. Team Member Contributions**

## 🟢 **Yiru Li — Product Owner / Full-Stack Developer**

**Contributions**

* Built **post creation** with **image upload**
* Implemented **comment functionality**
* Built the **post feed UI** and ensured consistency across pages
* Unified global UI styling and layout system
* Developed backend profile views
* Wrote full project documentation (this report, setup guides, scripts)

**Deliverables**

* Post & Comment models and Django views
* Unified CSS / UI system
* Documentation & setup scripts

---

## 🔵 **Ameesha Masand — Frontend Developer / UI Implementation**

**Contributions**

* Built **email input + registration UI**
* Integrated registration UI with backend domain validation
* Created styled form components and onboarding layout
* **Implemented the A/B test UI**, including “kudos/thanks” button variation and page styling
* Helped refine frontend styling across the app

**Deliverables**

* Registration components
* Error-state and form styling
* **A/B test UI implementation**

---

## 🟣 **Amber Tran — Backend Developer / Infrastructure**

**Contributions**

* Developed **registration + login backend**
* Implemented `@yale.edu` email domain validation
* Created database schema for user accounts
* Built backend API endpoints
* Configured Render deployments
* Implemented **A/B test backend variant assignment**

**Deliverables**

* Authentication system
* Domain check logic
* Deployment configuration (`render.yaml`)
* A/B test session logic

---

# 🔄 **6. A/B Test Endpoint Guide**

## 🎯 Purpose

Evaluate whether “kudos” or “thanks” yields more positive user interaction.

---

## 🔗 Endpoint URLs

| Environment | URL                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| Local       | [http://localhost:8000/1317cca/](http://localhost:8000/1317cca/)                                       |
| Render      | [https://agora-frontend-16kz.onrender.com/1317cca/](https://agora-frontend-16kz.onrender.com/1317cca/) |

---

## 🧠 How It Works

1. On first visit, user receives variant **A** or **B** randomly.
2. Variant stored in session (`request.session["ab_variant"]`).
3. Ameesha’s frontend displays corresponding button text.
4. Amber’s backend controls assignment logic.

---

## 🖥️ Backend Logic Example

```python
@csrf_exempt
@require_http_methods(["GET"])
def abtest_view(request):
    if 'ab_variant' not in request.session:
        request.session['ab_variant'] = random.choice(['A', 'B'])

    variant = request.session['ab_variant']
    button_text = 'kudos' if variant == 'A' else 'thanks'

    context = {
        'team_members': ['delightful-hamster', 'light-hedgehog', 'zealous-scorpion'],
        'button_text': button_text,
        'variant': variant
    }
    return render(request, 'abtest.html', context)
```

---

# 📎 **Final Summary**

Throughout three sprints, the team successfully delivered:

* A functional posting + commenting system
* Image upload capability
* Registration UI with Yale email domain check
* Unified frontend UI
* A/B testing infrastructure
* Full deployment to Render
* Complete documentation

Agora demonstrates the team's ability to execute a full-stack software project under agile methodology.


# 🔗 **Project Links**

1. **GitHub Repository:**
   [https://github.com/amberstran/mgt656_final_project](https://github.com/amberstran/mgt656_final_project)

2. **GitHub Project Board:**
   [https://github.com/users/amberstran/projects/2](https://github.com/users/amberstran/projects/2)

3. **Frontend (Render Deployment):**
   [https://agora-frontend-16kz.onrender.com/](https://agora-frontend-16kz.onrender.com/)

4. **Backend (Render Deployment):**
   [https://agora-backend-vavf.onrender.com/](https://agora-backend-vavf.onrender.com/)

5. **A/B Test Site:**
   [https://agora-frontend-16kz.onrender.com/1317cca/](https://agora-frontend-16kz.onrender.com/1317cca/)

