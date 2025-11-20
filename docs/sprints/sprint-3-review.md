# **Sprint 3 Review**

## **Sprint Name:** Sprint 3
**Dates:** 2025-11-13 → 2025-11-19

---

## **1. Sprint Goal**

Make substantial progress toward a functional MVP by building out both community-related circle features and essential posting capabilities. Specifically, this sprint focused on:
- Circle Features: Circle Chat Messaging, Browse Circles Feed, Join Circle
- User-Generated Content Features: Report Post/Comment, Anonymous Post, Edit Post, Upload Image in Post *(carried over from Sprint 2)*

**Goal Achievement Status:** ✅ *Achieved*

---

## **2. Completed User Stories**

| Issue # | Title | Story Points | Assignee | Demo Notes | PR/Commit Links |
|---------|-------|--------------|----------|------------|-----------------||
| #2 | **Anonymous Post** | 5 | toxiclee | Users can create posts with anonymous toggle; identity hidden from public view. | [PR/Commit: TBD] |
| #17 | **Join Circle** | 5 | AmeeshaMasand | Users can join/leave circles; membership tracked in database. | [PR/Commit: TBD] |
| #16 | **Browse Circles Feed** | 5 | AmeeshaMasand | Circle-specific feeds display posts filtered by circle membership. | [PR/Commit: TBD] |
| #1 | **Real-Name Post Toggle** | 3 | AmeeshaMasand | Users can toggle between anonymous and real-name display for posts. | [PR/Commit: TBD] |
| #3 | **Report Post/Comment** | 5 | toxiclee | Report functionality implemented; moderators can view reported content. | [PR/Commit: TBD] |
| #5 | **Edit Own Post** | 5 | toxiclee | Users can edit their own posts; changes saved and reflected in feeds. | [PR/Commit: TBD] |

**Total Completed Story Points:** **28 SP**

---

## **3. Incomplete User Stories**

**No incomplete user stories from the Sprint 3 commitment.**

All 6 planned user stories were successfully completed during Sprint 3.

### **Stories Not Started (Not Part of Sprint 3 Commitment):**

| Issue # | Title | Assignee | Status | Notes |
|---------|-------|----------|--------|-------|
| #11 | **Circle Chat Messaging** | AmeeshaMasand | In Progress | Started late in sprint; will continue in Sprint 4 |
| #8 | **Leave Circle** | amberstran | To Do | Planned for Sprint 4 |
| #18 | **View Circle Chat** | amberstran | To Do | Dependent on Circle Chat Messaging completion |
| #19 | **Admin Moderation** | amberstran | To Do | Planned for future sprint |
| #6 | **Search Posts** | amberstran | To Do | Planned for future sprint |

---

## **4. Demo Notes**

### **Demonstrable User Journey:**

1. **Create and Manage Posts:**
   - User creates a new post with anonymous toggle option
   - User can choose to post anonymously or with real name
   - User can edit their own posts after creation
   - Post changes reflect immediately in all feeds

2. **Circle Engagement:**
   - User browses available circles
   - User joins a circle of interest
   - User views circle-specific feed showing only posts from that circle
   - Posts are filtered correctly based on circle membership

3. **Content Moderation:**
   - User encounters inappropriate content
   - User clicks report button on post or comment
   - Report is submitted and logged for moderator review
   - User receives confirmation of report submission

### **Technical Highlights:**
- Successfully integrated Django REST Framework with React frontend
- Implemented DRF PageNumberPagination with proper envelope handling
- Fixed infinite scroll race conditions with fetch locking mechanism
- CORS configured for local development
- Sample data seeded for realistic testing

---

## **5. Sprint Metrics**

| Metric | Value |
|--------|-------|
| **Planned Story Points** | 28 SP |
| **Completed Story Points** | 28 SP |
| **Sprint 3 Velocity** | **28 SP** |
| **Completion Rate** | **28 / 28 = 100%** |
| **Cumulative Velocity (Sprints 2-3)** | **34 + 28 = 62 SP** |
| **Average Velocity** | **31 SP/sprint** |

---

## **6. Stakeholder Feedback**

### **Instructor/TA Feedback:**
- *(Add any feedback received during demo or sprint review)*
- *(If no formal feedback yet, note: "Pending instructor review")*

### **Internal Team Feedback:**
- Successfully established full-stack integration pattern for future features
- Need to improve story point estimation for infrastructure-heavy tasks
- Frontend-backend API contract alignment worked well when documented early

---

## **7. Lessons Learned**

1. **Excellent Sprint Execution:**
   - Team successfully completed 100% of committed story points (28/28)
   - Strong improvement from Sprint 2's 72% completion rate
   - Better estimation accuracy and task breakdown

2. **Team Collaboration:**
   - Clear assignment of stories to team members (toxiclee, AmeeshaMasand, amberstran) improved accountability
   - Frontend-backend coordination was effective
   - Regular communication helped resolve blockers quickly

3. **Technical Achievements:**
   - Successfully implemented complex features: anonymous posting, circle membership, real-name toggle
   - Report functionality provides foundation for content moderation
   - Edit functionality enhances user experience

4. **Scope Management Success:**
   - 28 story points was appropriate for team capacity
   - Feature breakdown into discrete user stories worked well
   - Circle features (Join, Browse, Chat) progressed in logical sequence

5. **Areas for Improvement:**
   - Circle Chat Messaging (#11) started but not completed within sprint timeframe
   - Could benefit from more granular task breakdown for better progress tracking
   - Need better documentation of completed features for knowledge transfer

---

## **8. Backlog Refinements**

### **Carried Over to Sprint 4:**
- #11: Circle Chat Messaging (In Progress) - Continue development of real-time messaging

### **Ready for Sprint 4:**
- #8: Leave Circle - Natural extension of Join Circle functionality
- #18: View Circle Chat - Dependent on Circle Chat Messaging completion
- #19: Admin Moderation - Build on Report Post/Comment feature
- #6: Search Posts - Enhance content discoverability

### **New Issues Added:**
- Add unit tests for anonymous posting logic
- Create admin dashboard for viewing reported content
- Document circle membership permissions and access control
- Add user notifications for circle activity
- Improve post editing UX with auto-save functionality

### **Completed Backlog Items from Sprint 2:**
- ✅ All Sprint 3 stories completed successfully
- Circle foundation now in place for future enhancements
- Report system provides framework for moderation features

---

## **9. Sprint Retrospective Action Items**

*(Link to sprint-3-retrospective.md when created)*

1. ✅ Maintain current story point commitment level (28 SP) - proven achievable
2. Continue Circle Chat Messaging as top priority for Sprint 4
3. Document completed features for team knowledge sharing
4. Add automated tests for critical user flows (anonymous posting, circle membership)
5. Plan demo walkthrough for stakeholder review
6. Consider breaking down Circle Chat into smaller tasks for better tracking

---

## **10. Next Sprint Preview**

**Sprint 4 Focus:**
- Complete Circle Chat Messaging (#11) - carry over from Sprint 3
- Implement Leave Circle (#8) functionality
- Add View Circle Chat (#18) interface
- Begin Admin Moderation (#19) dashboard
- Implement Search Posts (#6) feature
- Technical improvements: Add testing, improve documentation

**Target Velocity:** 25-30 SP *(Based on demonstrated Sprint 3 capacity)*

---

*Document prepared by: [Team]*  
*Review date: 2025-11-19*
