# DoubtBridge — Design System & Product Specification (`design.md`)

**DoubtBridge** is an intelligent doubt-clearing and peer-learning application for first-year students at **Assam Skill University**, designed as a native **iOS / iPadOS app** with a **Misty Rose, Coral Peach, and Pale Blush** two-tone curved sheet aesthetic, fully responsive across mobile and desktop.

---

## 1. Visual Architecture (Two-Tone Curved Sheet System)

- **Top Header Band (`#FBBFB5`):** Warm coral-peach header holding the primary white pill search/question bar (`#FFFFFF`, with voice dictation support), page context, and compact action pills.
- **Curved Overlapping Sheet (`#FCEBE8`, `rounded-t-[32px]`):** Pale misty rose main sheet resting cleanly above the coral-peach band.
- **Blush Content Tiles (`#F6D5D0` & `#FFF9F8`, `rounded-[22px]`):** Borderless tonal cards with generous padding (`16px`–`20px`) and crisp hierarchy, hosting Hint-first mode toggles, Cited Approved Materials, Practice Checks, Error Reports, and Topic Insights.
- **High-Contrast Controls (`#141212`):** Active filter pills use solid ink black with white text; inactive pills use subtle dark hairline outlines.
- **No Profile Pictures / No Display Photos:** Profile, navigation, and mentor cards use clean typography and initials monograms—never user portrait photos.

---

## 2. Color Tokens

| Token | Hex | Role |
| --- | --- | --- |
| **Header Peach** | `#FBBFB5` | Top navigation zone & soft action buttons |
| **Misty Rose Sheet** | `#FCEBE8` | Primary curved canvas & desktop sidebar |
| **Blush Tile** | `#F6D5D0` | Grid cards, prompt tiles, callout blocks |
| **Crisp Blush Surface** | `#FFF9F8` | Structured reading sheets, modals, active forms |
| **Ink Black** | `#141212` | Primary headings, active pill, floating mobile dock |
| **Muted Rose-Taupe** | `#6E5B59` | Secondary labels and timestamps |

---

## 3. Responsive Mobile & PC Behavior

- **Mobile (`< 768px`):** Edge-to-edge native iOS layout with coral-peach top header, white pill search/ask input, curved misty rose sheet, 2-column blush tile grids, bottom-anchored modal sheets, and a sleek floating dark dock (`#141212`) at the bottom.
- **Desktop / PC (`>= 768px`):** Fixed `240px` left iPadOS sidebar with active black pill navigation and picture-free Profile trigger, paired with a fluid multi-column (`max-w-5xl`) coral-peach + curved misty rose workspace.
