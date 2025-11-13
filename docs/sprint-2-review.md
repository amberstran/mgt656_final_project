Sprint 2 Review

Sprint Name: Sprint 2
Dates: 2025-11-06 → 2025-11-12

1. Sprint Goal

Deliver a functional Forum MVP on staging with essential browsing, posting, interaction, profile, and basic @yale.edu email verification capabilities.

2. Completed User Stories (with demo notes)

All user stories below were completed and demoed successfully.
| Issue # | Title                | Demo Notes                                                                |
| ------- | -------------------- | ------------------------------------------------------------------------- |
| #12     | **Personal Profile** | Demonstrated that logged-in users can access and view their profile page. |
| #14     | **Browse Hot Feed**  | Hot feed loads sorted by ranking; posts render correctly.                 |
| #15     | **Reply to Comment** | Reply box works; nested comments display properly.                        |
| #16     | **Comment on Post**  | Users can comment; comment count and UI update instantly.                 |
| #18     | **Browse New Feed**  | New feed shows latest posts in correct chronological order.               |
| #19     | **Delete Own Post**  | Users can delete their own post; feed refreshes automatically.            |
| #20     | **Like Post**        | Likes update immediately; counters increase without refresh.              |

🖼 Screenshots
![ui](https://github.com/user-attachments/assets/ad807eb5-f4e0-43f4-8179-922437a07826)

3. Incomplete User Stories
| Issue # | Title                                          | Reason Not Completed                                           | Disposition            |
| ------- | ---------------------------------------------- | -------------------------------------------------------------- | ---------------------- |
| #13     | **NetID Verification (@yale.edu email check)** | Change in implementation approach; validation logic postponed. | Carry over to Sprint 3 |
| #17     | **Upload Image in Post**                       | Required backend static/media setup; time was insufficient.    | Carry over to Sprint 3 |


4. Sprint Metrics
| Metric                     | Value             |
| -------------------------- | ----------------- |
| **Planned Story Points**   | 47                |
| **Completed Story Points** | 34                |
| **Velocity**               | **34 SP**         |
| **Completion Rate**        | **34 / 47 = 72%** |

5. Lessons Learned

—— Some infrastructure-heavy tasks (like image upload) need earlier technical setup and testing.

—— Breaking down user stories could help reduce uncertainty (e.g., split image upload into backend config + UI integration).

—— UI alignment meetings early in the sprint help reduce rework.

—— Daily standups successfully helped unblock progress quickly.

—— Clearer acceptance criteria for verification logic could avoid mid-sprint ambiguity.

6. Product Backlog Updates

* Carried over #13 and #17 to Sprint 3.

* Added follow-up UI improvement tasks for feed display and nested comments.

* Added bug-fix backlog items found during demo (scroll issues, async updates).

* Reprioritized Circle-related features to later sprints due to MVP focus.

* Added a potential enhancement: send verification email (future MVP+).


