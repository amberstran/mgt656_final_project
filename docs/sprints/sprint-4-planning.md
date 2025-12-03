# 📝 Sprint 4 Planning: Agora Forum MVP

## 🎯 Sprint Goal

[cite_start]The primary goal for Sprint 4 was to achieve **Production Deployment** and implement the **A/B Testing Endpoint** [cite: 2, 78][cite_start], establishing a production-ready social media application (Agora) with user authentication, content management, and A/B testing analytics[cite: 2].

---

## ✅ Selected User Stories, Assignments, and Status

Based on the sprint plan and the successful completion detailed in the report, the following core stories were prioritized and completed:

| User Story | Assignee(s) (Based on previous plan) | Story Points Committed | Status |
| :--- | :--- | :--- | :--- |
| Production Deployment | **Yiru Li** | (TBD) | [cite_start]Done [cite: 3] |
| A/B Endpoint Implementation | **amberstran**, **AmeeshaMasand** | (TBD) | [cite_start]Done [cite: 3] |
| Analytics Setup | (TBD - Team Effort) | (TBD) | [cite_start]Done [cite: 3] |

### [cite_start]Production Details [cite: 4]

* [cite_start]**Frontend URL (React SPA):** `https://agora-frontend-16kz.onrender.com` [cite: 6]
* [cite_start]**Backend API URL (Django):** `https://agora-backend-vavf.onrender.com` [cite: 7]
* [cite_start]**A/B Test Endpoint URL:** `https://agora-frontend-16kz.onrender.com/1317cca/` [cite: 8, 43]

---

## 🛠️ Key Technical Achievements (What's Working)

[cite_start]The team successfully implemented and deployed the following functionalities to production[cite: 9, 3]:

* [cite_start]User authentication (login/logout with session management) [cite: 10]
* [cite_start]User registration with profile fields [cite: 11]
* [cite_start]Cross-site cookie handling (CSRF, CORS configured) [cite: 12]
* [cite_start]Database migrations on PostgreSQL (all 26 applied successfully) [cite: 13]
* [cite_start]Posts and circles API endpoints [cite: 18]

## 🧪 A/B Testing & Analytics Setup

[cite_start]The sprint successfully established the A/B testing framework[cite: 42]:

* [cite_start]**Endpoint Functionality:** Session-based variant assignment ensures a consistent variant per visitor[cite: 14, 57].
* [cite_start]**Test Case:** A button with ID `abtest` [cite: 54] is being tested:
    * [cite_start]Variant A displays: **"KUDOS"** [cite: 55]
    * [cite_start]Variant B displays: **"THANKS"** [cite: 56]
* [cite_start]**Google Analytics Tracking (G-725FXLYK55):** [cite: 59]
    * [cite_start]**Events Tracked:** `ab_test_view` (on page load) and `button_click`[cite: 61, 62].
    * [cite_start]**Custom Dimensions:** `variant` ("A" or "B") and `button_text` ("kudos" or "thanks")[cite: 63, 64, 65].

---

## 🚧 Remaining MVP Features (Product Backlog)

[cite_start]The following key MVP features remain in the backlog for the next development period[cite: 83]:

* Leave Circle
* View Circle Chat
* Admin Moderation
* Search Post

---

## 🚀 Sprint Velocity Summary

*(To be updated in the Sprint Review document: `sprint-4-review.md`)*

* [cite_start]Sprint 2 velocity: X points [cite: 70]
* [cite_start]Sprint 3 velocity: Y points [cite: 71]
* [cite_start]Sprint 4 velocity: Z points [cite: 72]
* [cite_start]Average velocity: W points [cite: 73]
