# Product Requirements Document (PRD)

## 1. Product Overview

- **Product Name:** ClarifyU — Intelligent Doubt-Clearing Assistant for First-Year Students
- **Problem Reference:** #27 — Intelligent Doubt-Clearing Assistant for First-Year Students
- **Document Version:** 1.0
- **Target Stack:** React 19, Vite 8, TypeScript, Tailwind CSS v4, Express.js, Gemini API (`@google/genai`)

### 1.1 Problem Statement
First-year university and college students frequently hesitate to ask questions during live lectures due to fear of judgment, large classroom sizes, or unfamiliarity with foundational terminology. Outside classroom hours, students often face long delays before receiving responses from faculty or teaching assistants, leaving conceptual gaps unresolved before assignments and exams.

### 1.2 Product Vision
ClarifyU is an AI-first doubt-resolution and peer-learning React web application that provides **instant, judgment-free academic help 24/7**, seamlessly escalates complex or unresolved questions to **senior peer mentors and faculty**, and connects every doubt to **curated, syllabus-aligned learning resources**.

---

## 2. Goals & Success Metrics

| Goal | Primary Metric | Target |
| --- | --- | --- |
| Reduce hesitation to ask questions | % of doubts submitted using Anonymous Mode | >= 40% of student posts |
| Eliminate out-of-hours response delays | Median time to first AI response | < 5 seconds |
| Fast human escalation when needed | Median time to Senior/Faculty reply on escalated doubts | < 4 hours |
| Encourage peer learning & reuse | % of doubts resolved via existing Q&A or curated resources | >= 30% |
| Empower faculty insight | Weekly review of top-confused topics per first-year course | >= 80% faculty adoption |

---

## 3. Target Users & Personas

1. **First-Year Student (Primary User)**
   - Needs a safe, low-friction space (with optional anonymity) to ask basic or advanced doubts anytime.
   - Wants step-by-step explanations rather than bare final answers, plus links to relevant notes or videos.
2. **Senior Peer Mentor (2nd–4th Year Student)**
   - Wants an organized queue of unresolved doubts filtered by subjects they excel in (e.g., Calculus, Programming in C/Python, Engineering Physics).
   - Earns mentorship recognition and "Helpful Answer" endorsements.
3. **Faculty Member / Teaching Assistant**
   - Wants to avoid answering the same question 50 times over email.
   - Needs visibility into which lecture topics are generating the most student doubts, plus one-click verification of AI or peer answers.

---

## 4. Core Features & Functional Requirements

### 4.1 Low-Friction & Anonymous Doubt Submission
- **FR-1.1:** Students can submit doubts with a title, detailed description, course/subject tag, and difficulty/urgency level.
- **FR-1.2:** Students can toggle **"Post Anonymously"** so their identity is hidden from peers (while optionally remaining auditable for moderation).
- **FR-1.3:** Support for formatted code blocks, mathematical expressions, and optional image/screenshot attachments (e.g., handwritten notes or error logs).

### 4.2 Instant 24/7 AI Doubt-Clearing Assistant
- **FR-2.1:** Upon submission (or in an interactive AI Doubt Chat), the Express backend calls Gemini (`@google/genai`) to generate an immediate, structured explanation.
- **FR-2.2:** AI responses follow a **pedagogical structure**:
  1. Core Concept Recap
  2. Step-by-Step Walkthrough / Hint
  3. Common Pitfalls to Avoid
  4. Suggested Follow-up Practice Question
- **FR-2.3:** The AI returns a confidence/clarity signal and offers a one-click **"Still confused? Escalate to Senior / Faculty"** action.

### 4.3 Smart Peer & Faculty Escalation Routing
- **FR-3.1:** Unresolved doubts enter a tagged Escalation Queue routed to available Senior Mentors first, and Faculty/TAs for syllabus-critical or unanswered items.
- **FR-3.2:** Senior Mentors and Faculty can reply in threaded discussions, attach corrections, and mark a response as **Verified Solution**.
- **FR-3.3:** Students receive status updates (`AI Answered`, `Escalated to Senior`, `Faculty Verified`).

### 4.4 Peer-Learning Feed & Collaborative Q&A
- **FR-4.1:** Public (non-private) doubts appear in a searchable, filterable feed organized by first-year subjects (Mathematics, Computer Science, Physics, Chemistry, Electronics, Communication).
- **FR-4.2:** Students can click **"I have this doubt too"** (upvote) to boost visibility and notify mentors of widespread confusion.
- **FR-4.3:** Similar existing doubts are surfaced automatically while a student types a new question to prevent duplicates.

### 4.5 Curated Learning Resources Hub
- **FR-5.1:** A structured repository of faculty-approved notes, cheat sheets, video walkthroughs, and prerequisite refreshers tagged by course and module.
- **FR-5.2:** Every AI answer and Q&A thread recommends 1–3 relevant curated resources from the hub.

### 4.6 Faculty Topic Confusion Analytics
- **FR-6.1:** A clean dashboard view for faculty showing top upvoted doubts, unresolved queue counts, and most-asked topics per week so instructors can address them in the next lecture.

---

## 5. Technical Architecture & Data Models

### 5.1 System Architecture
See [`architecture-diagram.svg`](./architecture-diagram.svg) for the full visual architecture diagram.

1. **Frontend (React 19 + Vite + Tailwind CSS v4 + Lucide React + Motion):** Single-page application with role-aware views (Student Workspace, Peer Q&A Feed, Mentor/Faculty Queue, Curated Resources Hub).
2. **Backend Proxy & Router (`server.ts` with Express):** Serves Vite middleware in development and static assets in production; exposes REST endpoints under `/api/*` and keeps `GEMINI_API_KEY` strictly server-side.
3. **AI Service (`@google/genai`):** Handles structured doubt resolution, Socratic tutoring prompts, duplicate/topic classification, and resource matching.
4. **Persistence Layer:** Stores users/roles, doubts, AI & human replies, upvotes, and curated resources.

### 5.2 Core Data Entities

- **User:** `id`, `name`, `role` (`student` | `senior` | `faculty`), `department`, `subjects[]`
- **Doubt:** `id`, `authorId`, `isAnonymous`, `courseCode`, `topicTag`, `title`, `body`, `codeSnippet?`, `status` (`ai_answered` | `escalated_senior` | `escalated_faculty` | `verified`), `upvotes`, `createdAt`
- **Reply:** `id`, `doubtId`, `authorType` (`ai` | `senior` | `faculty` | `peer`), `authorName`, `content`, `isVerified`, `createdAt`
- **Resource:** `id`, `courseCode`, `topicTag`, `title`, `type` (`notes` | `video` | `practice` | `cheatsheet`), `url`, `recommendedBy`

### 5.3 Planned Backend API Endpoints

- `GET /api/doubts` — List/search doubts with filters (`course`, `topic`, `status`, `sort`)
- `POST /api/doubts` — Create a new doubt and automatically trigger initial AI response
- `POST /api/ai/resolve` — Interactive follow-up doubt clarification via Gemini API
- `POST /api/doubts/:id/upvote` — Increment "I have this doubt too" count
- `POST /api/doubts/:id/escalate` — Route doubt to Senior Mentor or Faculty queue
- `POST /api/doubts/:id/replies` — Post a peer, senior, or faculty reply (with verification flag)
- `GET /api/resources` — Fetch curated learning resources filtered by course/topic
- `GET /api/analytics/topics` — Aggregated doubt counts by topic for faculty insights

---

## 6. Non-Functional Requirements

- **Security & Privacy:** `GEMINI_API_KEY` must never be exposed to the browser; all AI calls route through `/api/*`. Anonymous student identities must not leak in public API responses.
- **Performance:** Initial page load < 2s; UI transitions smooth and accessible across desktop and mobile viewports.
- **Accessibility:** Keyboard-navigable forms, semantic HTML, high-contrast typography, and clear visual hierarchy.

---

## 7. Implementation Roadmap

1. **Phase 1 — Foundation & Core Doubt Flow:** Express server + React app shell, Doubt Submission form (with anonymous toggle), and Gemini-powered instant AI Doubt Resolver.
2. **Phase 2 — Peer Learning & Escalation:** Public Q&A feed, upvote system, Senior Mentor & Faculty escalation queue, and Verified Solution badges.
3. **Phase 3 — Curated Resources & Faculty Insights:** Resource hub integration, automatic resource recommendations per doubt, and topic confusion analytics dashboard.
