# **Sprint 4 Review**

## **Sprint Name:** Sprint 4

## **1. Sprint Goal Achievement**

### **Sprint Goal**

Deploy the Agora Forum MVP to **production**, implement the **A/B testing endpoint**, integrate **analytics**, and advance remaining MVP features required for final submission.

### **Achievement Summary**

**Core goals achieved:**

* ✅ Production deployment completed
* ✅ A/B testing endpoint implemented
* ✅ Analytics (GA4) integrated and verified


---

## **2. Completed User Stories**

| Issue / Work Item                                     | Title                                                           | Story Points | Assignee(s)               | Status | Notes                                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------- | ------------ | ------------------------- | ------ | ---------------------------------------------------------------------------- |
| **Production Deployment**                             | Full-stack deployment to Render (SPA + Django API + PostgreSQL) | **8**        | Yiru Li                   | Done   | Frontend, backend, DB, environment variables, and CSRF/CORS all configured   |
| **#1 Real-Name Post Toggle (Used for A/B Test Base)** | A/B test button logic (A/B variants)                            | **3**        | AmeeshaMasand, amberstran | Done   | Session-persistent A/B variant selection                                     |
| **Analytics Setup**                                   | GA4 integration with custom events + dimensions                 | **5**        | amberstran                | Done   | Events: `ab_test_view`, `button_click`; dimensions: `variant`, `button_text` |

### **A/B Testing Summary**

* Variant A: **“KUDOS”**
* Variant B: **“THANKS”**
* Session-based consistency
* GA4 property: **G-725FXLYK55**

### **Production URLs**

* **Frontend:** [https://agora-frontend-16kz.onrender.com](https://agora-frontend-16kz.onrender.com)
* **Backend:** [https://agora-backend-vavf.onrender.com](https://agora-backend-vavf.onrender.com)
* **A/B test endpoint:** [https://agora-frontend-16kz.onrender.com/1317cca/](https://agora-frontend-16kz.onrender.com/1317cca/)

---

## **3. Incomplete User Stories (Moved to Final Submission Period)**

| Issue # | Title            | Story Points | Status | Notes                                             |
| ------- | ---------------- | ------------ | ------ | ------------------------------------------------- |
| #8      | Leave Circle     | 3            | To Do  | Requires membership management integration        |
| #18     | View Circle Chat | 5            | To Do  | Depends on chat backend + UI work                 |
| #6      | Search Posts     | 5            | To Do  | Important UX feature; may be selectively included |

We may selectively include some of these features based on time and priority during the final submission period.

---

## **4. Demo: What’s Working in Production**

### **Core Features Successfully Demonstrated**

* Fully deployed **React SPA** + **Django backend** + **PostgreSQL** database
* Authentication (session-based login/logout)
* User profiles
* Post creation, display, and deletion
* Commenting + nested comments
* Liking posts
* Reporting posts/comments
* A/B testing endpoint with real-time GA4 event tracking
* All API endpoints operational in production
* CORS/CSRF configured for cross-site session cookies

---

### 📸 **Screenshots **


#### ** – Landing Page (Production)**

![9758f425e2d055ef08769bdbc26f6c39](https://github.com/user-attachments/assets/e8aae217-108e-486a-a471-53ae1dd897c3)

*Shows deployment success and UI entry point.*

#### **Screenshot 2 – Main Feed (Posts, Comments, Auth Debug)**
![49e35b711d79193aa8da6c5bdf942ab0](https://github.com/user-attachments/assets/cfd488b5-ee76-4a11-8d9e-4617e110e0bc)

*Shows core functionality: posts, comments, likes, report/delete, session status.*

---

## **5. Metrics**

### **Sprint 4 Velocity**

| Metric                 | Value     |
| ---------------------- | --------- |
| Planned Story Points   | 16        |
| Completed Story Points | **16**    |
| **Velocity**           | **16 SP** |

### **Cumulative Velocity Across All Sprints**

| Sprint   | Velocity |
| -------- | -------- |
| Sprint 2 | 34 SP    |
| Sprint 3 | 28 SP    |
| Sprint 4 | 16 SP    |

**Total:** **78 Story Points completed**

### **Average Velocity**

[
(34 + 28 + 16) / 3 = 26  SP per sprint
]

---

## **6. Production Deployment Status**

### **Status:**

✅ **Production system is live and stable**

### **Details**

* All database migrations applied (26 total)
* Backend/API accessible with CORS & CSRF configurations
* Frontend fully deployed with static assets
* Session cookies + login working
* Analytics events streaming to GA4
* All major endpoints functioning correctly

---

## 7.Readiness for Final Submission

### ✅ What’s Complete
- Production deployment fully live (Frontend + Backend + PostgreSQL)
- Authentication, user profiles, posting, commenting, liking, reporting
- A/B test endpoint implemented (KUDOS / THANKS variants)
- GA4 analytics integrated with custom events and dimensions
- Core system stable and ready for demonstration

---

### 📝 What Remains for the Next 9 Days
We may selectively implement 1–2 additional MVP features depending on feasibility:

- Leave Circle  
- View Circle Chat  
- Admin Moderation  
- Search Posts  

Additional tasks:
- Minor UI polish  
- Final testing and bug fixes  
- Clean up debug components

---

### ⚠️ Risks & Mitigation

#### **1. Limited Time**
- Only implement small, low-risk features  
- Prioritize Leave Circle / basic admin tools  

#### **2. Cookie / Session Reliability in Production**
- Re-test login persistence across browsers  
- Adjust Render domain settings if issues arise  

#### **3. Analytics Consistency**
- Verify GA4 event logs before demo  
- Use DebugView to confirm variant tracking  

#### **4. Regression Risk from New Features**
- Freeze core system early in the week  
- Implement new features in separate branches  
- Run quick manual regression tests before merging

---

## 🟡 Overall Readiness
Core system is complete and production-ready.  
Additional MVP features will be added selectively based on remaining time and priority.



---

## **8. Summary**

Sprint 4 successfully delivered all required **production**, **A/B testing**, and **analytics** functionalities.
These represent foundational components for a real, scalable social forum application.
The upcoming final submission will focus on completing the remaining MVP features and polishing the user experience.

---

