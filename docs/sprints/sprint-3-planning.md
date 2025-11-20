# **Sprint 3 Planning**

## **Sprint Goal**

The goal of Sprint 3 was to make substantial progress toward a functional MVP by building out both community-related circle features and essential posting capabilities. Specifically, this sprint focused on:

### **Circle Features**

* Circle Chat Messaging
* Browse Circles Feed
* Join Circle

### **User-Generated Content Features**

* Report Post/Comment
* Anonymous Post
* Edit Post
* Upload Image in Post *(carried over from Sprint 2)*

---

## **Selected User Stories**

### **1. Anonymous Post**

* **Story Points:** 5
* **Priority:** Medium
* **User Story:**
  *As a user, I want to create anonymous posts, so I can share freely without revealing my identity.*
* **Acceptance Criteria:**

  1. Given a logged-in user, when anonymity is selected during post creation, the post displays anonymously.
  2. When viewed by others, the username is hidden.
  3. Moderators/admins can still identify the poster internally.

---

### **2. Join Circle**

* **Story Points:** 5
* **Priority:** Low
* **User Story:**
  *As a user, I want to join an interest circle, so I can participate in group discussions.*
* **Acceptance Criteria:**

  1. Clicking "Join" adds the user to the circle membership.
  2. Members can post within the circle and posts appear in the circle feed.
  3. When a user leaves, membership is removed and their posts no longer appear in circle feeds.

---

### **3. Browse Circle Feed**

* **Story Points:** 5
* **Priority:** Low
* **User Story:**
  *As a user, I want to see posts from my interest circles, so I can focus on topics I care about.*
* **Acceptance Criteria:**

  1. Selecting a circle shows only posts from that circle.
  2. When a user leaves a circle, those posts no longer appear.
  3. Clicking a post opens its full content.

---

### **4. Real-Name Post Toggle**

* **Story Points:** 3
* **Priority:** Medium
* **User Story:**
  *As a user, I want to toggle my post to real-name, so I can be recognized for contributions.*
* **Acceptance Criteria:**

  1. Selecting "real name" during posting displays the user's name + school publicly.
  2. Switching back to anonymous before posting hides identity.
  3. Saved posts store the correct identity state in the database.

---

### **5. Report Post/Comment**

* **Story Points:** 5
* **Priority:** Low
* **User Story:**
  *As a user, I want to report inappropriate content, so moderators can review it.*
* **Acceptance Criteria:**

  1. Clicking "Report" logs a report against the post/comment.
  2. Moderators can view submitted reports and the associated content.
  3. Users receive confirmation that their report was submitted.

---

### **6. Edit Own Post**

* **Story Points:** 5
* **Priority:** Medium
* **User Story:**
  *As a user, I want to edit my posts, so I can correct mistakes or update information.*
* **Acceptance Criteria:**

  1. Users can edit any post they own.
  2. Saved edits update in the feed and profile.
  3. Edit history is stored internally for moderation.

---

## **Story Points Committed**

| User Story            | Story Points        |
| --------------------- | ------------------- |
| Anonymous Post        | 5                   |
| Join Circle           | 5                   |
| Browse Circle Feed    | 5                   |
| Real-Name Post Toggle | 3                   |
| Report Post/Comment   | 5                   |
| Edit Own Post         | 5                   |
| **Total Committed**   | **28 Story Points** |

---

## **Team Assignments**

| Team Member               | Assigned Stories                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| **AmeeshaMasand**  | Anonymous Post, Join Circle, Report Content, Edit Post, Identity Toggle logic                   |
| **toxiclee** | Circle Feed UI, Join/Leave Circle UX, Anonymous/Real-name toggle UI, Edit Post modal, Report UI |
| **amberstran**    | Integrating circle feeds + chat, coordinating API contracts, reviewing database updates         |

---

## **Dependencies**

* Image Upload requires carrying over backend work from Sprint 2.
* Circle Chat Messaging depends on real-time communication setup (WebSockets).
* Moderation tools rely on backend report logging to be complete.
* Frontend development depends on finalized API endpoints from backend.

---

## **Risks**

* Real-time chat integration may exceed estimated capacity.
* Image upload could block post creation features if API not finalized.
* Anonymous/real-name identity toggle requires careful testing to avoid privacy leaks.
* Circle membership logic may introduce edge cases (e.g., posting while leaving).
