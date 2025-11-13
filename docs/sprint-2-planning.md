## Sprint 2 Planning

Sprint Name: Sprint 2 <br>
Start Date: 2025-11-06 <br>
End Date: 2025-11-12  <br>
Duration: 7 days <br>

### Sprint Goal:

Deliver a functional Forum MVP on staging with essential browsing, posting, interaction, and basic verification capabilities.
The sprint focuses on enabling users to:

1) View feeds (hot/new)

2) Interact with posts (comment, reply, like, delete)

3) Access personal profiles

4) Register using @yale.edu email

5) Upload images in posts

### Planned User Stories for Sprint 2: 

| Issue # | Title                                                  | Story Points | Priority |
| ------- | ------------------------------------------------------ | ------------ | -------- |
| #12     | **Personal Profile**                                   | 8            | High     |
| #13     | **NetID Verification (email must end with @yale.edu)** | 8            | High     |
| #14     | **Browse Hot Feed**                                    | 5            | High     |
| #15     | **Reply to Comment**                                   | 5            | High     |
| #16     | **Comment on Post**                                    | 5            | High     |
| #17     | **Upload Image in Post**                               | 5            | High     |
| #18     | **Browse New Feed**                                    | 5            | High     |
| #19     | **Delete Own Post**                                    | 3            | High     |
| #20     | **Like Post**                                          | 3            | High     |


Total Committed Story Points
47 story points planned for Sprint 2.

### Team Capacity & Assignments

| Team Member       | Capacity | Assigned Stories                                                         |
| ----------------- | -------- | ------------------------------------------------------------------------ |
| **toxiclee**      | Full     | #12 Personal Profile, #13 Email (@yale.edu) Validation, #17 Upload Image |
| **amberstran**    | Full     | #14 Browse Hot Feed, #18 Browse New Feed                                 |
| **AmeeshaMasand** | Full     | #15 Reply, #16 Comment, #19 Delete, #20 Like                             |


### Dependencies Identified

| User Story               | Dependency                        | Notes                                        |
| ------------------------ | --------------------------------- | -------------------------------------------- |
| #17 Image Upload         | Static/media file settings        | Must configure backend before use            |
| #14 / #18 Feed browsing  | Requires stable post DB structure | Already supported by post creation           |
| #10 Search (future)      | Needs populated posts             | Not in this sprint but relevant later        |
| ❌ #13 NetID Verification | **No external CAS dependency**    | Simple email domain validation for @yale.edu |

### Risks & Mitigation Strategies
| Risk                                         | Impact | Mitigation                        |
| -------------------------------------------- | ------ | --------------------------------- |
| Incorrect email validation logic             | Low    | Use regex + domain check          |
| Media path misconfiguration for uploads      | Medium | Test early in sprint              |
| UI/UX inconsistency across feeds             | Low    | Daily visual sync                 |
| Team load high with many high-priority items | Medium | Daily standups to unblock quickly |






