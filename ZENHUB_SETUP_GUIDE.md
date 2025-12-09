# ZenHub Setup Guide: Burndown Charts & Velocity Tracking

**Project:** Agora Yale Community Platform  
**Purpose:** Track sprint progress, velocity, and burndown charts  
**Cost:** Free for public repositories  

---

## Table of Contents

1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [Sprint Configuration](#sprint-configuration)
4. [Tracking Progress](#tracking-progress)
5. [Viewing Reports](#viewing-reports)
6. [Best Practices](#best-practices)

---

## Installation

### Step 1: Install ZenHub Extension

#### For Chrome:
1. Go to [ZenHub Chrome Extension](https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhfbmddcdlhnnmnlnijcodblen)
2. Click "Add to Chrome"
3. Confirm the permissions

#### For Firefox:
1. Go to [ZenHub Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/zenhub/)
2. Click "Add to Firefox"
3. Confirm the permissions

#### For Safari/Edge:
1. Use the web version: [ZenHub Web App](https://app.zenhub.com)
2. Sign in with your GitHub account

### Step 2: Verify Installation

1. Navigate to your GitHub repository: `https://github.com/amberstran/mgt656_final_project`
2. Look for a **"ZenHub"** tab next to "Issues" and "Pull Requests"
3. If you see it, installation is successful ✅

---

## Initial Setup

### Step 1: Create a ZenHub Workspace

1. Click the **"ZenHub"** tab on your GitHub repo
2. If this is your first time, click **"New Workspace"**
3. Enter a workspace name (e.g., "Agora Yale Development")
4. Select your GitHub organization/account
5. Click **"Create Workspace"**

### Step 2: Link GitHub Issues

1. In ZenHub, go to **Settings** → **Repositories**
2. Select your repository: `amberstran/mgt656_final_project`
3. ZenHub will automatically import all GitHub issues
4. Configure issue labels for tracking:
   - **Priority:** Critical, High, Medium, Low
   - **Status:** Backlog, Ready, In Progress, In Review, Done
   - **Type:** Feature, Bug, Epic, Story

### Step 3: Set Up Estimation (Story Points)

1. Go to **Settings** → **Workspace**
2. Enable **"Estimates"**
3. Choose estimation scale:
   - **Fibonacci:** 1, 2, 3, 5, 8, 13, 21 (recommended)
   - Or custom: 1, 2, 4, 8, etc.
4. Save settings

---

## Sprint Configuration

### Step 1: Create Sprints

#### For Sprint 1:
1. Click **"Sprints"** in the left sidebar
2. Click **"New Sprint"**
3. Enter details:
   - **Name:** Sprint 1 - User Authentication & Profile Management
   - **Start Date:** (when Sprint 1 started)
   - **End Date:** (when Sprint 1 ended)
   - **Sprint Length:** 1 week (or your actual sprint duration)
4. Click **"Create Sprint"**

#### For Sprint 2:
1. Repeat the process
2. **Name:** Sprint 2 - Content Management & Circle System
3. **Duration:** 1 week

#### For Sprint 3:
1. Repeat the process
2. **Name:** Sprint 3 - Agora Sparks & Final Polish
3. **Duration:** 1 week

### Step 2: Add Issues to Sprints

1. Go to **Issues** in ZenHub
2. For each issue:
   - Click the issue title
   - On the right panel, select **"Sprint"** dropdown
   - Assign to appropriate sprint (Sprint 1, 2, or 3)
   - Set **"Estimate"** (story points): 1, 2, 3, 5, 8, etc.
   - Set **"Status"**: Backlog → Ready → In Progress → In Review → Done

### Step 3: Example Sprint Configuration

#### Sprint 1 Issues (16 completed):
```
- [3 pts] User authentication with Yale CAS login
- [2 pts] User profile page creation
- [2 pts] Profile editing functionality
- [3 pts] Email verification system
- [3 pts] User registration form
- [3 pts] Database setup and migrations
```

#### Sprint 2 Issues (20 completed):
```
- [3 pts] Post creation and display
- [3 pts] Comment system with nesting
- [2 pts] Like/heart functionality
- [3 pts] Circle creation and management
- [3 pts] Circle membership system
- [3 pts] Post image upload
- [2 pts] Content moderation tools
```

#### Sprint 3 Issues (28 completed):
```
- [3 pts] Agora Sparks scoring system
- [3 pts] Level progression (Ember→Aurora)
- [3 pts] Circle chat messaging
- [2 pts] User search functionality
- [2 pts] Feed ranking/sorting
- [2 pts] Performance optimization
- [3 pts] Frontend polish and UI/UX
- [3 pts] Testing and QA
- [2 pts] Deployment to Render
- [2 pts] Documentation
```

---

## Tracking Progress

### Daily Sprint Tracking

1. **At Sprint Start:**
   - Verify all issues have story point estimates
   - Total should match your sprint capacity (e.g., 28 SP for Sprint 3)

2. **During Sprint:**
   - Move issues through status pipeline: Backlog → Ready → In Progress → In Review → Done
   - ZenHub automatically tracks remaining points
   - Update issue status daily for accurate burndown

3. **Example Daily Progress (Sprint 3):**
   - **Day 1:** 28 SP total, 0 SP completed (28 remaining)
   - **Day 2:** 5 SP completed (23 remaining)
   - **Day 3:** 8 SP completed (20 remaining)
   - **Day 4:** 12 SP completed (16 remaining)
   - **Day 5:** 20 SP completed (8 remaining)
   - **Day 6:** 28 SP completed (0 remaining) ✅

---

## Viewing Reports

### Access ZenHub Reports

1. Click **"Reports"** in the left sidebar
2. Select the sprint you want to view

### Reports Available:

#### 1. Burndown Chart
- **What it shows:** Remaining story points vs. ideal burn rate over time
- **How to read:** 
  - Blue line = actual remaining points
  - Red line = ideal/target burn rate
  - Goal: Blue line should touch 0 by sprint end
- **Location:** Reports → Burndown

#### 2. Velocity Chart
- **What it shows:** Story points completed per sprint
- **How to read:**
  - Sprint 1: 16 SP
  - Sprint 2: 20 SP
  - Sprint 3: 28 SP
- **Location:** Reports → Velocity

#### 3. Cumulative Flow Diagram
- **What it shows:** Distribution of issues across statuses over time
- **How to read:**
  - Shows bottlenecks in your workflow
  - Helps identify process improvements
- **Location:** Reports → Cumulative Flow

#### 4. Sprint Reports
- **What it shows:** Sprint summary with completion %, velocity, etc.
- **Location:** Reports → Sprint Summary

---

## Sprint Velocity Analysis

### Calculate Your Team's Velocity

```
Velocity = Story Points Completed / Number of Sprints

Agora Yale Project:
- Sprint 1: 16 SP
- Sprint 2: 20 SP
- Sprint 3: 28 SP

Average Velocity = (16 + 20 + 28) / 3 = 21.3 SP/sprint
```

### Use Velocity for Planning

```
Sprint 4 Planning:
- Available Capacity: 21.3 SP (based on average velocity)
- Add issues to sprint until you reach ~21 SP
- Leave 10-20% buffer for contingencies
- Target Sprint 4 Capacity: 18-20 SP
```

### Velocity Trends

| Sprint | Velocity | Change | Notes |
|--------|----------|--------|-------|
| 1      | 16 SP    | —      | Team ramp-up |
| 2      | 20 SP    | +25%   | Process improvements |
| 3      | 28 SP    | +40%   | Full team productivity |

---

## Best Practices

### 1. **Story Point Estimation**
- Use **Fibonacci scale** (1, 2, 3, 5, 8, 13, 21)
- Compare to previously completed stories
- Account for unknowns (+1 size for unfamiliar tech)
- Avoid over-optimism; use 13-21 for complex features

### 2. **Daily Standup Updates**
- Move issues to "In Progress" when starting
- Move to "In Review" when submitting PR
- Move to "Done" when merged and tested
- This keeps burndown chart accurate

### 3. **Sprint Planning**
- Plan for 70-80% of average velocity
- Leave 20-30% buffer for bugs and surprises
- Prioritize features by business value
- Keep sprint goal focused and achievable

### 4. **Retrospectives**
- Review burndown: Did you complete on time?
- Check velocity: Is it trending up, down, or stable?
- Identify blockers: What slowed you down?
- Plan improvements: What can we do better next sprint?

### 5. **Backlog Management**
- Keep backlog groomed and prioritized
- Break large epics into smaller stories (5-13 SP)
- Remove completed or obsolete items
- Add refinement sessions before sprint planning

---

## Quick Reference: ZenHub Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `E` | Open estimate/planning poker |
| `S` | Change sprint |
| `L` | Add label |
| `A` | Assign issue to user |
| `P` | Assign priority |
| `?` | Show all shortcuts |

---

## Troubleshooting

### Issue: ZenHub tab not appearing
- **Solution:** Refresh GitHub page after installing extension
- **Alternative:** Use ZenHub web app at https://app.zenhub.com

### Issue: Issues not syncing
- **Solution:** Go to ZenHub → Settings → Sync → Force Sync

### Issue: Burndown chart shows incorrect data
- **Solution:** Verify issue statuses are correct
- **Check:** All completed issues should be in "Done" status

### Issue: Velocity seems low
- **Solution:** Check if all story points are assigned to issues
- **Review:** Past sprints to ensure estimates are consistent

---

## Moving Forward with Sprint 4

1. **Create Sprint 4** with planned story points (~20 SP based on velocity)
2. **Prioritize backlog** using ZenHub
3. **Start sprint** and monitor burndown daily
4. **Adjust scope** if burndown shows delays
5. **Complete sprint** and generate velocity report

---

## Additional Resources

- [ZenHub Official Documentation](https://help.zenhub.com)
- [Agile Estimation Guide](https://www.atlassian.com/agile/estimation)
- [Burndown Chart Best Practices](https://www.atlassian.com/agile/scrum/burndown-charts)
- [Velocity Tracking](https://www.atlassian.com/agile/scrum/velocity)

---

## Summary

✅ **ZenHub Setup Complete** when you can:
1. See ZenHub tab on your GitHub repo
2. Create and view sprints
3. Assign story points to issues
4. View burndown and velocity charts
5. Update issue status to track progress

**Next Step:** Start Sprint 4 with ZenHub tracking to monitor progress in real-time! 🚀
