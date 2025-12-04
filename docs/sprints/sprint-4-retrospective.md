# Sprint 4 Retrospective

## ✅ What Went Well
1. **Production deployment was successful and stable.**  
   Both frontend and backend deployed cleanly on Render, database migrations worked, and cross-site session handling was correctly configured.

2. **A/B testing framework was fully implemented.**  
   Session-based variant assignment and GA4 event tracking were integrated smoothly, giving us a measurable analytics setup.

3. **Team collaboration and division of work were efficient.**  
   Each member’s domain (deployment, A/B logic, analytics) was clearly defined, minimizing overlap and speeding up delivery.

4. **Core system remained stable despite deployment complexity.**  
   Authentication, posting, commenting, and likes all continued to work without regression after deployment.

---

## ⚠️ What Didn’t Go Perfectly (and How We Adapted)
1. **We adjusted our feature scope to prioritize production readiness.**  
   Some MVP features (e.g., Leave Circle, View Circle Chat, Search Posts) were intentionally deferred so the team could focus on deployment, analytics, and ensuring the core system was production-stable.

2. **Deployment and environment configuration took more time than anticipated.**  
   Cross-site cookie setup and CORS/CSRF adjustments required multiple rounds of refinement, which shifted development time away from feature work — but ultimately strengthened the stability of the final system.



---

## 📌 What to Improve for the Final Submission Period
- **Scope carefully and only add low-risk, feasible features.**  
  Focus on small, high-impact items rather than starting complex or interdependent features like full circle chat.

- **Stabilize and freeze the core system early.**  
  Avoid regressions in posting flows or authentication while integrating remaining features.

- **Increase testing before merging changes.**  
  Manual regression testing will be especially important to maintain reliability.

- **Polish UI/UX for final presentation.**  
  Improve spacing, alignment, and consistency to make the product look professional.

---

## 🗒️ Action Items (Next 9 Days)
1. **Select 1–2 MVP features to implement (based on feasibility).**  
   Likely candidates: Leave Circle, Admin Moderation (basic version).

2. **Polish UI:**  
   Clean up feed layout, button styling, post detail view, and error states.

3. **Test production environment thoroughly:**  
   Validate login persistence, A/B variant assignment, and analytics events.

4. **Prepare the final demo flow:**  
   Ensure all key paths (login → feed → post → comment → A/B test page) load quickly and look clean.

5. **Finalize documentation:**  
   Complete final submission write-up, diagrams, and README updates.

---

## 🌟 Project Reflection: What We Learned Across All Sprints
- **Deployment and infrastructure matter as much as features.**  
  Early sprints focused heavily on functionality, but deploying a stable production system proved equally challenging and valuable.

- **Clear story scoping is essential.**  
  Overly large or ambiguous stories (e.g., chat systems, moderation flows) slowed progress; breaking work into smaller pieces helped tremendously.

- **Front-end and back-end integration requires tight coordination.**  
  Authentication, CORS/CSRF, and session handling taught the team how real-world full-stack systems behave.

- **Analytics and experimentation add real product value.**  
  Building the A/B testing and GA4 integration showed how data-driven features support product decisions.

- **Iterative delivery works.**  
  Across all sprints, the team improved velocity, clarity, and quality — going from feature building → refinement → production readiness.

---


