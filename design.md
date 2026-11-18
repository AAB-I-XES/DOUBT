# DOUBTLY — Design System & Product Specification (`design.md`)

**DOUBTLY** is an intelligent doubt-clearing and peer-learning platform for first-year university students, styled with an **iOS / iPadOS native aesthetic** and a **Misty Rose & Pale Pink/Blush** palette across mobile and desktop viewports.

---

## 1. Design Philosophy

- **Native iOS Clarity & Warmth:** Combines iOS inset grouped lists, translucent navigation bars, segmented controls, and bottom-sheet drawers on mobile with a spacious multi-column iPadOS/macOS sidebar workspace on PC.
- **Tactile & Ergonomic:** Every interactive row, tab, and action button honors a minimum `44px` touch hitbox on mobile and crisp hover/active states on desktop.
- **Restrained Misty Rose Palette:** Uses soft misty rose and pale blush surfaces to create a calm, anxiety-reducing study environment without visual clutter.

---

## 2. Color System (Misty Rose & Pale Pink / Blush)

| Token | Hex | Role |
| --- | --- | --- |
| **Canvas (Grouped Background)** | `#FCF6F6` | Soft blush-white primary background |
| **Elevated Surface** | `#FFFFFF` | Inset grouped cards, modals, and inputs |
| **Sidebar Tint** | `#F9EFEF` | Subtle warm blush sidebar backdrop on desktop |
| **Misty Rose** | `#FFE4E1` | Active navigation highlights, icon tiles, subtle emphasis |
| **Pale Blush** | `#F8E8E8` | Segmented control track, soft hover surfaces |
| **Primary Rose Accent** | `#C45B72` | Active tab icons, primary rose buttons, progress fills |
| **Deep Rose** | `#A64258` | High-contrast text links and hover states |
| **Primary Ink** | `#221D1E` | Warm charcoal headings and body copy |
| **Secondary Text** | `#7B6F71` | Muted metadata, timestamps, secondary labels |
| **Separator (Hairline)** | `#EFE2E2` | Crisp `1px` dividers and card borders |

---

## 3. Typography & Surface Geometry

- **Sans-Serif:** `Plus Jakarta Sans` (paired with Apple system fallbacks `-apple-system, BlinkMacSystemFont, "SF Pro Text"`).
- **Monospace:** `IBM Plex Mono` for course codes, inline code, and `tabular-nums` alignment.
- **Mathematics:** `KaTeX` for inline (`$...$`) and block (`$$...$$`) equations.
- **iOS Surface Radii:** `rounded-2xl` (`16px`) for grouped list containers and cards, `rounded-xl` (`12px`) for buttons, inputs, and thumbnails, `rounded-t-3xl` (`24px`) for mobile bottom sheets.

---

## 4. Responsive Navigation Architecture

### Mobile (`< 768px`)
- **Sticky Translucent Navigation Bar (`48px`):** `backdrop-blur-md bg-[#FCF6F6]/85` with current view title, `DOUBTLY` mark, and Profile avatar button.
- **Fixed iOS Tab Bar (`56px`):** Translucent bottom bar (`backdrop-blur-lg bg-[#FCF6F6]/90 border-t border-[#EFE2E2]`) with 5 thumb-friendly tabs (`Overview`, `Ask`, `Community`, `Resources`, `Mentors`). Combined sticky height stays well within 15% of mobile viewport height.
- **Bottom Sheets:** Dialogs (`Ask Community`, `Request Help`, `Resource Preview`) anchor to the bottom on mobile (`rounded-t-3xl`) with a centered drag handle affordance.

### Desktop / PC (`>= 768px`)
- **Fixed iPadOS/macOS Sidebar (`256px`):** Translucent blush sidebar (`#F9EFEF`) with `DOUBTLY` brand lockup, 5 grouped navigation rows, and bottom Student Profile button.
- **Multi-Column Workspace (`max-w-5xl`–`max-w-6xl`):** Overview, Community, Mentors, Resources, and Profile expand naturally across 2-column and 3-column desktop grids, while Ask Doubt maintains an optimal `max-w-3xl` editorial reading measure.
