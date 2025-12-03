# 📝 Sprint 4 Planning (sprint-4-planning.md)

## 🎯 Sprint Goal

The goal of Sprint 4 is to **deploy the Agora Forum MVP to production**, **implement the A/B testing endpoint**, and **complete remaining MVP features necessary to deliver a fully functional social forum application**.
This includes production infrastructure, analytics instrumentation, and core feature stabilization.

---

## 📌 Selected User Stories for Sprint 4

The following user stories were selected based on team priority, dependency order, and sprint capacity.
Story points are taken directly from the Product Backlog on GitHub.

---

### **1. Production Deployment**

**Story Points:** 8
**Assignee:** **Yiru Li**
**Status:** Done

**Scope includes:**

* Frontend deployment (Render)
* Backend API deployment (Render)
* PostgreSQL setup
* Build optimization for React SPA
* CORS/CSRF configuration
* Environment variable + secret management
* Full database migration (26 migrations)

**Production URLs:**

* **Frontend:** [https://agora-frontend-16kz.onrender.com](https://agora-frontend-16kz.onrender.com)
* **Backend:** [https://agora-backend-vavf.onrender.com](https://agora-backend-vavf.onrender.com)
* **A/B Endpoint:** [https://agora-frontend-16kz.onrender.com/1317cca/](https://agora-frontend-16kz.onrender.com/1317cca/)

---

### **2. A/B Endpoint Implementation (#1)**

**Story Points:** 3
**Assignees:** **Ameesha Masand**, **amberstran**
**Status:** Done

**Deliverables:**

* Session-based variant assignment
* UI integration for A/B test button
* Variant A: “KUDOS”
* Variant B: “THANKS”
* Consistent variant per user session
* Event triggers connected to analytics

---

### **3. Analytics Setup (#6 Support Work)**

**Story Points:** 5
**Assignee:** **amberstran**
**Status:** Done

**Deliverables:**

* Google Analytics property (G-725FXLYK55)
* Custom event tracking

  * `ab_test_view`
  * `button_click`
* Custom dimensions:

  * `variant` (A/B)
  * `button_text` ("kudos" / "thanks")
* Integration with frontend A/B component

---

## 📌 Remaining MVP Features in Backlog

These features remain incomplete and carry forward to the next sprint:

| User Story             | Story Points | Status |
| :--------------------- | :----------- | :----- |
| Leave Circle (#8)      | 3            | To Do  |
| View Circle Chat (#18) | 5            | To Do  |
| Admin Moderation (#19) | 5            | To Do  |
| Search Post (#6)       | 5            | To Do  |

These will form the basis of Sprint 5 planning.

---

## 🧑‍🤝‍🧑 Team Assignment Summary

| Area                        | Owner(s)                           | Notes                                    |
| :-------------------------- | :--------------------------------- | :--------------------------------------- |
| Production Deployment       | **Yiru Li**                        | Infra setup, testing, SPA/API deployment |
| A/B Endpoint Implementation | **Ameesha Masand**, **amberstran** | Experiment logic + UI + routing          |
| Analytics Setup             | **amberstran**                     | GA4 integration + event definitions      |
| Remaining MVP Features      | Entire Team                        | Still in backlog for Sprint 5            |



