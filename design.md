# DOUBTLY — Design System & Product Specification (`design.md`)

**DOUBTLY** is an intelligent doubt-clearing and peer-learning platform for first-year university students, designed around **Swiss minimalism** and **modern editorial product design** (inspired by Linear, Notion, Apple, Read.cv, and contemporary academic tools).

---

## 1. Design Philosophy

> **Core Principle:** *Remove everything that does not improve usability. Make simplicity the defining visual feature of DOUBTLY.*

1. **Editorial Clarity Over Dashboard Clutter:** Content reads like a well-typeset academic notebook rather than a telemetry console.
2. **Restraint & Generous Whitespace:** Layouts rely on clean alignment, open breathing room, and `1px` hairline dividers instead of heavy shadows or nested card grids.
3. **Zero AI-Slop Discipline:** No gradient hero banners, no glassmorphism, no floating decorative elements, no pulsing status dots, no chatbot avatars, and no pill-badge clutter.
4. **Purposeful Controls:** Every button, filter, and metadata element serves a direct student or mentor workflow.

---

## 2. Color System

| Token | Hex | Role | Usage Rule |
| --- | --- | --- | --- |
| **Background Canvas** | `#FAF9F7` | Primary app background | Warm off-white paper tone (~60%+ of viewport) |
| **Surface** | `#FFFFFF` | Focused inputs, active containers, modals | Subtle contrast against `#FAF9F7` without shadows |
| **Primary Text** | `#222222` | Headings, body copy, primary actions | High-legibility almost-black ink |
| **Secondary Text** | `#858585` | Metadata, timestamps, muted labels | Quiet typographic hierarchy |
| **Primary Accent** | `#A99AE8` | Muted lavender | Used sparingly for active focus, progress fill, and key indicators |
| **Secondary Accent** | `#F3E8E7` | Very light blush | Soft active row selection, unanswered highlight, subtle hover tint |
| **Hairline Border** | `#EAE8E5` | Structural separation | `1px` dividers between lists, sidebar, and panels |

### Color Restraint Rules
- At least 85–90% of any viewport remains neutral (`#FAF9F7`, `#FFFFFF`, `#222222`, `#858585`, `#EAE8E5`).
- Status is never communicated by color alone; explicit text labels (`Answered`, `Unanswered`, `Available now`, `Faculty Verified`) always accompany visual cues.

---

## 3. Typography & Spatial Grid

- **UI & Editorial Sans:** `Plus Jakarta Sans` (weights `400`, `500`, `600`, `700`) for clean legibility and crisp structural headings.
- **Technical & Tabular Monospace:** `IBM Plex Mono` for code blocks, course codes (`CS101`, `MA102`), and aligned numeric counts (`tabular-nums`).
- **Mathematical Typesetting:** `KaTeX` for crisp inline (`$...$`) and block (`$$...$$`) equations.

### Type Scale
- **Page Greeting / Title:** `28px` (`1.75rem`), SemiBold (`600`), tight tracking (`-0.02em`)
- **Section Heading:** `15px`–`16px`, Medium/SemiBold (`500`–`600`)
- **Body / AI Explanation:** `15px`, Regular (`400`), `1.65` line-height, `65ch`–`72ch` comfortable measure
- **Metadata & Labels:** `12px`–`13px`, `#858585`, unboxed inline text separated by middots (`·`)

### Radius & Elevation
- **Subtle Rectangular Geometry:** `6px` (`rounded-md`) for buttons, rows, and thumbnails; `8px` (`rounded-lg`) for primary composer containers.
- **Flat Hairline Elevation:** `1px solid #EAE8E5` borders replace drop shadows across the entire platform.

---

## 4. Navigation & Responsive Architecture

### Desktop (`>= 768px`)
- **Fixed Left Sidebar (`240px`):**
  - Top: Small `DOUBTLY` wordmark (plain editorial tracking, no subtitle badges).
  - Primary Navigation: `Overview`, `Ask Doubt`, `Community`, `Resources`, `Mentors`.
  - Bottom Anchor: Compact student row linking to `Profile` (`Alex Rivera · 1st Year CS`).
- **Main Content Area:** Centered reading/working column (`max-w-4xl`) with generous top and horizontal padding on `#FAF9F7`.

### Mobile (`< 768px`)
- **Compact Top Bar:** Minimal `DOUBTLY` wordmark on the left and `Profile` button on the right.
- **Compact Bottom Navigation:** Fixed rectangular bar (`56px` height, `1px` top border `#EAE8E5`, `bg-[#FAF9F7]`) with 5 clean icon + label tabs (`Overview`, `Ask`, `Community`, `Resources`, `Mentors`).

---

## 5. Screen Specifications

### 5.1 Overview (Dashboard)
- **Greeting:** `"Good morning, Alex."` with subtle semester/major line.
- **Primary Focus Input:** Clean rectangular prompt box (`"What are you stuck on?"`) that submits directly into the **Ask Doubt** workspace.
- **Learning Activity Summary:** Compact single-row hairline summary (`tabular-nums`) showing Doubts Resolved, Community Replies, and Saved Resources.
- **Recent Questions:** Clean border-separated list with subject, timestamp, and status as quiet inline metadata.
- **Available Mentors:** Compact list rows (small `32px` portrait, name, department, availability text, `Request` action).

### 5.2 Ask Doubt (Ask AI)
- **Distraction-Free Reading Flow:** No chatbot avatars and no chat bubbles. Questions render as clean editorial prompts; AI explanations render as structured academic documents.
- **Composer:** Large central question input with **Image / PDF attachment** (`image/*`, `.pdf`) and course subject selector.
- **Structured AI Output:** Concept summary, numbered step-by-step walkthrough with **KaTeX mathematical equations** and monospace code blocks, common pitfall callout (hairline bordered, never thick left-accent bars), and action bar (`Copy`, `Save`, `Helpful`, `Escalate to Mentor`).
- **Follow-up Suggestions:** Plain text clickable prompts (`→ ...`) below the explanation.

### 5.3 Community
- **Minimal Academic Feed:** Subject filter tabs (`All`, `Calculus`, `Data Structures`, `Physics`, `Linear Algebra`, `Digital Logic`), status filter (`All`, `Unanswered`, `Answered`), search bar, and `Ask Community` modal/composer (including an **Anonymous Mode** toggle).
- **Thread Rows:** Question title, student name (or `Anonymous`), subject, response count, clear `Unanswered` vs `Answered` / `Faculty Verified` distinction, upvote button, and expandable thread view for posting replies.

### 5.4 Mentors
- **Directory Layout:** Clean 2-column grid / list of Faculty and Senior Peer Mentors filterable by role (`All`, `Faculty`, `Senior Mentors`) and subject.
- **Compact Mentor Row:** Small `44px` portrait, name, department, expertise areas, plain text availability indicator, and `Request help` button opening a focused request modal.

### 5.5 Resources
- **Compact List Library:** Organized by subject and document type (`PDF`, `Notes`, `Slides`, `Problem Set`, `Cheat Sheet`) with simple Lucide file-type icons, search, filter tabs, bookmark toggle, and clean preview reader drawer.

### 5.6 Profile
- **Student Information:** Name, academic standing, enrolled courses.
- **Minimal Progress Visualization:** Clean horizontal completion bar (`#A99AE8` on `#EAE8E5`) and compact 7-day study consistency strip.
- **Personal Collections:** Tabbed view of **Saved Doubts**, **Bookmarked Resources**, and **Community Contributions**.
