# Testing Plan

## Acceptance Testing Process

- **Who:** All team members (Product Designer, Developers, PM)
- **When:** At the end of each sprint
  - Sprint 1: April 24 – May 8
  - Sprint 2: May 9 – May 22
- **How:**
  - Developers conduct unit and integration testing during feature completion
  - Product Designer and PM lead manual acceptance testing using the Acceptance Testing Script
  - All defects are logged as GitHub Issues
  - Code must pass acceptance testing before merging into the main branch

---

## Testing Process

- **Unit Tests:** Developers write and run unit tests for core components
- **Integration Tests:**
  - Integration points tested manually (e.g., login + dashboard routing, chat + backend)
  - No automated integration testing planned
- **Manual Acceptance Tests:** Product Designer and PM manually test full user flows
- **Performance Tests:**
  - **Tools:** Chrome DevTools (Performance tab)
  - **Devices:**
    - 2023 MacBook Air (M3)
    - 2021 iPad Pro 11”
  - **Metrics:**
    - Largest Contentful Paint (LCP) under 3 seconds
    - Total page load under 3 seconds
  - **Process:**
    - Reload pages and record performance during login and dashboard loading
    - Review LCP and total load time in performance results

---

## Test Environments

- **Staging Development:** Developer local machines
- **Testing Deployment:** Vercel (staging deployment)
- **Browsers:** Latest Chrome on macOS 15 Sequoia, Safari on iPadOS 18
- **Devices:**
  - 2023 MacBook Air (M3)
  - 2021 iPad Pro 11”

---

## Failure Protocol

- Bugs found during testing must be logged as GitHub Issues
- Issues are:
  - Labeled as `"bug"`
  - Assigned to a developer
  - Prioritized based on severity
- Critical bugs must be resolved before sprint ends
- Minor bugs may be moved to the backlog

---

## Acceptance Testing Script

### Login/Signup

**Context:** User is given login credentials by carehome owner

1. Go to login page  
   - ✅ Expect: "Log-in" banner, Username/Password fields (Login-1)

2. Enter wrong username and submit  
   - ✅ Expect: "Username does not exist" alert (Login-2)

3. Enter wrong password  
   - ✅ Expect: "Password incorrect" alert (Login-3)

4. Enter correct credentials  
   - ✅ Expect: Redirect to dashboard (Login-4)

---

### Elder Dashboard

**Context:** Elder is logged in

1. View dashboard  
   - ✅ Expect: "How are you feeling today?" (Elder-1)

2. Select mood emoji  
   - ✅ Expect: Emoji highlights (Elder-2)

3. Press "Need Something?"  
   - ✅ Expect: Support request option (Elder-3)

4. Hold "Want to Talk?"  
   - ✅ Expect: Audio records until released (Elder-4)

5. Add optional note or photo  
   - ✅ Expect: File uploads / note saved (Elder-5)

6. Submit without mood  
   - ✅ Expect: Mood field error, no submission (Elder-6)

7. Submit with mood  
   - ✅ Expect: Confirmation message, caregiver notified (Elder-7)

8. No check-in by 5PM  
   - ✅ Expect: Alert sent to caregiver (Elder-8)

---

### Caregiver Dashboard

**Context:** Caregiver is logged in

1. View elder cards  
   - ✅ Expect: Name, photo, age, mood, notes (Caregiver-1)

2. Check meal/meds/etc.  
   - ✅ Expect: Checklist updates (Caregiver-2)

3. Add text/audio notes  
   - ✅ Expect: Notes saved (Caregiver-3)

4. Missed task  
   - ✅ Expect: Alert triggered (Caregiver-4)

5. Filter analytics  
   - ✅ Expect: Chart updates by date/elder (Caregiver-5)

---

### Family Dashboard

**Context:** Family member is logged in

1. View elder mood  
   - ✅ Expect: Latest mood status (Family-1)

2. View activity timeline  
   - ✅ Expect: List of activities (Family-2)

3. Toggle notifications  
   - ✅ Expect: Settings saved (Family-3)

4. Send message to caregiver  
   - ✅ Expect: Message sent (Family-4)

---

### Chat

**Context:** Any role logged in

1. Open chat  
   - ✅ Expect: Chat screen opens (Chat-1)

2. Send text message  
   - ✅ Expect: Message appears with timestamp (Chat-2)

3. Send voice message  
   - ✅ Expect: Voice clip icon and timestamp (Chat-3)

4. Attach file  
   - ✅ Expect: Preview shown, sent on submit (Chat-4)

5. React with emoji  
   - ✅ Expect: Emoji shown on message (Chat-5)

6. Disconnect internet  
   - ✅ Expect: Alert shown, message not sent (Chat-6)

---

### Shared Timeline

**Context:** User is logged in

1. View shared timeline  
   - ✅ Expect: Entries sorted by date/time (Timeline-1)

2. Filter by date  
   - ✅ Expect: Only that day’s entries (Timeline-2)

3. Filter by user  
   - ✅ Expect: Only that user’s entries (Timeline-3)

4. Filter by update type  
   - ✅ Expect: Only that type’s entries (Timeline-4)

5. Expand timeline entry  
   - ✅ Expect: Show full details (Timeline-5)

---


