## Sprint 2 Retrospective

Date: 2025-11-12 <br>
Attendees: Yiru Li, Amber Tran, Ameesha Masand

### 1.What Went Well

Core MVP features were completed smoothly

Hot feed, new feed, commenting, replying, liking, and deleting posts all worked as planned.

Team collaboration and communication were effective

Daily standups helped unblock tasks quickly and reduced confusion.

Frontend UI integration improved significantly

Feed layout, comment UI, and profile page became more consistent and easy to use.

### 2.What Didn’t Go Well

Image upload story (#17) required more backend setup than expected

Static/media configuration and file handling took longer than planned.

Email verification (#13) was more complex than estimated

Even without CAS login, implementing “send verification email during registration” required additional setup (SMTP, token logic), delaying completion.

Some user stories were too large

This reduced visibility on progress and made estimation harder.

### 3. What to Improve

#### 1.Plan and configure infrastructure-dependent tasks earlier

Action: Identify backend-related tasks in Sprint Planning and complete setup on Day 1.

#### 2.Break down complex stories into smaller, technical subtasks

  Action: Split features like email verification into:

    email format check

    send email

    verify token

    UI states

#### 3.Clarify implementation requirements before sprint start

  Action: Add a quick review of technical requirements during grooming.

### 4. Action Items

| Action Item                                              | Assignee      | Due Date                 |
| -------------------------------------------------------- | ------------- | ------------------------ |
| Configure SMTP + token-based email verification (#13)    | Yiru Li       | 2025-11-15               |
| Set up static/media configuration for image upload (#17) | Yiru Li       | 2025-11-15               |
| Break down large user stories and create subtasks        | Full team     | Before Sprint 3 Planning |
| Add a UI alignment session at the start of Sprint 3      | AmeeshaMasand | Start of Sprint 3        |


