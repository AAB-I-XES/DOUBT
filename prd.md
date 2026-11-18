# Product Requirements Document (PRD)

## 1. Product Overview

- **Product Name:** DoubtBridge — Intelligent Doubt-Clearing Assistant for First-Year Students
- **Institution & Team:** Assam Skill University · Department of CSE / Information Technology (AI & ML) · Group No. 5 (Shristii Baruah `IT26B0120`, Aichajya Neog `IT26B0121`, S Sushmi Singha `IT26B0122`)
- **Problem Reference:** #27 — Intelligent Doubt-Clearing Assistant for First-Year Students
- **Document Version:** 2.0
- **Target Stack:** React 19, Vite 8, TypeScript, Tailwind CSS v4, KaTeX, Express.js, Gemini API (`@google/genai`)

### 1.1 Problem Statement
First-year university and college students frequently hesitate to ask questions during live lectures due to fear of judgment, large classroom sizes, or unfamiliarity with foundational terminology. Outside classroom hours, students often face long delays before receiving responses from faculty or teaching assistants, leaving conceptual gaps unresolved before assignments and exams.

### 1.2 Product Vision
**DoubtBridge** is an AI-first, syllabus-grounded doubt-resolution and peer-learning application that provides **instant, judgment-free academic help 24/7**, classifies doubts by subject, grounds explanations in **approved study materials**, prevents passive over-reliance via **Hint-first mode and Practice checks**, seamlessly escalates unresolved questions to **faculty and senior mentors**, and surfaces **Topic Insights** to help instructors refine teaching.

---

## 2. Goals & Success Metrics

| Goal | Primary Metric | Target |
| --- | --- | --- |
| Frictionless multi-modal doubt asking | Doubts submitted via text, image/PDF snap, or voice | < 15s submission flow |
| Eliminate out-of-hours response delays | Median time to first grounded AI explanation | < 5 seconds |
| Prevent over-reliance on direct answers | Adoption of Hint-first mode & Practice checks | >= 40% of Ask Doubt sessions |
| Fast human escalation when needed | Subject-matched escalation to Faculty / Senior Mentors | 1-click routing |
| Continuous accuracy & moderation | Flagged AI answers reviewed via Report Error queue | 100% faculty visibility |

---

## 3. Target Users & Personas

1. **First-Year Student (Primary User — e.g., Shristii Baruah, IT26B0120)**
   - Needs a safe, judgment-free space to submit doubts via text, photo/PDF, or voice anytime.
   - Wants step-by-step explanations grounded in approved course notes, optional hints before full answers, and follow-up practice checks.
2. **Faculty & Course Instructors**
   - **Abhishek Sharma** (Maths / Calculus)
   - **Dr. Paragjyoti** (Physics)
   - **Munsifa Khan** (C Programming)
   - Need visibility into common topic confusion via **Topic Insights**, plus a moderation queue of student-flagged AI answers.
3. **Senior Peer Mentor (e.g., Rohan Sen)**
   - Resolves escalated C Programming, Calculus, and Physics doubts and shares exam tips with first-year batches.

---

## 4. Core Features & Functional Requirements

### 4.1 Multi-Modal Doubt Submission (Type / Snap / Speak)
- **FR-1.1:** Students can type questions in the Overview quick-ask bar or dedicated Ask Doubt workspace.
- **FR-1.2:** Students can attach handwritten problem images or PDFs for visual step-by-step analysis.
- **FR-1.3:** Students can use Web Speech API **Voice Input** (`Speak`) to dictate questions hands-free.

### 4.2 Classify, Retrieve & Grounded AI Tutor
- **FR-2.1:** The backend classifies the doubt by subject (`Calculus`, `Physics`, `C Programming`) and retrieves matching entries from the **Approved Study Materials** catalog.
- **FR-2.2:** Gemini (`@google/genai`) generates structured responses containing:
  1. Core Concept & Explanation
  2. Step-by-Step Breakdown with KaTeX math formatting
  3. Cited Approved Study Materials (clickable links to the Resources library)
  4. Interactive **Practice Check** question with a toggleable hint
  5. Follow-up prompts
- **FR-2.3:** **Hint-First Mode** toggle switches the AI tutor to Socratic coaching (guiding hints + checkpoint question before revealing final values).

### 4.3 Subject-Matched Escalation & Error Moderation
- **FR-3.1:** One-click **"Escalate to mentor"** routes the question and AI summary directly to the subject-matched faculty member or senior mentor.
- **FR-3.2:** **"Report error"** lets students flag an AI response (`Inaccurate step or calculation`, `Off-syllabus explanation`, `Needs faculty verification`), updating Topic Insights for faculty review.

### 4.4 Peer Discussions, Topic Insights & Approved Resources
- **FR-4.1:** **Community** offers both **Discussions** (subject filters, upvotes, replies) and **Topic Insights** (doubt volume breakdown by subject, unanswered counts, and flagged AI answers).
- **FR-4.2:** **Resources** provides a searchable, filterable, bookmarkable repository of approved lecture notes, lab manuals, and cheat sheets.
- **FR-4.3:** **Profile** tracks solved doubts, bookmarked resources, and community contributions in a clean, picture-free layout.

---

## 5. Technical Architecture

See [`architecture-diagram.svg`](./architecture-diagram.svg) for the visual system block diagram.

1. **Frontend (React 19 + Vite 8 + Tailwind CSS v4 + KaTeX + Lucide React):** Responsive iOS/iPadOS two-tone Misty Rose & Coral Peach interface across mobile and desktop.
2. **Backend Proxy (`server.ts` with Express):** Serves Vite middleware in development and static assets in production; exposes `/api/ask-doubt` and `/api/health`, keeping `GEMINI_API_KEY` strictly server-side.
3. **AI & Retrieval Engine (`@google/genai`):** Performs subject classification, approved-material citation matching, Hint-first Socratic reasoning, and Practice Check generation.
