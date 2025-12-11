
# Sprint 1 — Review

*Reference: Sprint 1 Report.pdf*

## Sprint Goal Recap

Sprint 1 focused on product discovery, user research, vision definition, and technical planning.
The goal was to ensure the team deeply understood graduate student needs and established a coherent plan for an MVP.

---

## Completed Work

### 1. User Research and Personas

The team created three detailed personas.

#### Persona 1: Maya Chen

Adjusting to graduate life, socially isolated, seeking everyday guidance.
![Maya](https://github.com/user-attachments/assets/59d434f2-48b5-4047-aa01-a78d02b34529)

#### Persona 2: Arjun Patel

Overwhelmed by workload, limited time for friendships.
![Arjun](https://github.com/user-attachments/assets/8f214b0f-ff35-49dd-a38a-c61822b54558)

#### Persona 3: Lina Rodriguez

Entrepreneurial, looking for teammates, events, and mentorship.
![Lina](https://github.com/user-attachments/assets/9c404c88-6a62-4a56-8832-c8d911f201cc)

Each persona includes:

* Demographics
* Challenges and pain points
* Motivations and behaviors
* Journey mapping across stages

---

### 2. Problem Validation

Through interviews, affinity mapping, and journey analysis, Sprint 1 validated key user problems:

* Students lack a centralized, cross-school platform for peer connection.
* Incoming students struggle with navigation, social life, housing, and general orientation.
* Existing solutions (department chats, Discords, GroupMe) are fragmented and siloed.
* Many students feel hesitant to ask questions publicly due to embarrassment or lack of anonymity.
* There is no consistent space for interest-based micro-communities.

---

### 3. Product Vision and MVP Definition

The team established a clear vision for Agora:
A Yale-exclusive, anonymous-friendly community forum designed to help graduate students connect, ask questions freely, and join micro-communities.

#### MVP Feature Set

* Create posts (text + optional image)
* Comment and reply
* Like posts
* Edit and delete own posts
* Anonymous posting toggle
* Real-name toggle
* User profile page
* NetID verification
* Search posts
* Upload image in post
* Join and leave circles
* Browse Circle feed
* Hot Feed and New Feed
* Report post or comment
* Admin moderation
* Circle chat (send and view messages)

---

### 4. Wireframes and User Flow Design

Wireframes were created for all major application flows:

* Login (CAS)
* New / Hot / Circles feeds
* Circle page and chat interface
* Post creation with image upload and anonymity toggle
* Comment threads
* Search results
* User profile

These wireframes were validated during the sprint demo.

---

### 5. Technical Architecture Planning

#### System Stack

* Backend: Django + Django REST Framework
* Database: PostgreSQL
* Deployment: Render

#### Data Schema

Users, Posts, Comments, Likes, Circles, Messages, Reports

#### Development Workflow

* Feature branches
* Pull request reviews
* CI linting
* GitHub Project automation

This architecture provides a stable foundation for Sprint 2 implementation.

---

### 6. Backlog Creation

The team completed a structured product backlog containing:

* 20 full user stories
* Each with user story statement and acceptance criteria
* Assigned priorities and story points
* Status labels (Done, In Progress, In Review)
* Total story points: 99

This backlog is ready for development planning in Sprint 2.

---

## Sprint Summary

Sprint 1 successfully delivered the foundational product, UX, and technical work needed for the Agora MVP.
The team now has a validated set of user needs, a defined MVP scope, and a complete backlog prepared for execution.




