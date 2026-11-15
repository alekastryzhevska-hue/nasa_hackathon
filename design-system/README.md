# WALL-E & EVE — design system

Design system of the astronaut health-monitoring app. Owner: alekastryzhevska-hue (design).
Source of truth: the "WALL-E & EVE" Design System artifact on claude.ai; this folder is a
copy for the code. Last synced: 2026-11-15.

The theme is **dark only**: the interface lives on board, in dim light, and must be readable
at a glance without dazzling.

## Files

| File | What | How to use |
|---|---|---|
| `tokens.css` | All tokens as CSS variables + text style classes + font import | Import once (e.g. in `src/main.tsx`: `import '../design-system/tokens.css'`), then use `var(--gray-80)`, `var(--green-default)`, class `ds-h1`, etc. |
| `tokens.json` | The same tokens as data, with a usage note for each | Reference; use it if a value is needed in TypeScript (charts, SVG fills) |
| `README.md` | Rules: which token for what | Read before styling anything |

Never hard-code a hex value that exists as a token; use the variable.

## Gray scale (cool gray)

Neutrals are built in OKLCH with one hue, a cold blue (hue 255), so all grays share one
"space" tone. Chroma is highest in the dark steps (blue reads as depth) and almost vanishes
in the light steps, so text stays clean.

Naming: **gray-100 is the darkest, gray-0 the lightest**, step 10.

| Token | HEX | Role |
| --- | --- | --- |
| `gray-100` | #060c13 | Deepest background / overlay |
| `gray-90` | #0d141e | App background |
| `gray-80` | #151e29 | Surface 1 (cards) |
| `gray-70` | #1f2a38 | Surface 2 (inputs, hover) |
| `gray-60` | #323e4e | Dividers |
| `gray-50` | #4b596b | Control borders |
| `gray-40` | #6b798a | Placeholder, disabled |
| `gray-30` | #8e99a9 | Secondary text |
| `gray-20` | #b2bbc8 | Body text |
| `gray-10` | #d6dbe3 | Headings |
| `gray-0` | #f2f5f9 | Accent text |

### Rules

- Layers go up in lightness: `gray-90` (background) → `gray-80` (card) → `gray-70` (element
  inside a card). Shadows are almost invisible in a dark theme; depth comes from the gray step.
- Text: `gray-20` for body, `gray-10` for headings, `gray-30` for secondary. On `gray-80` and
  `gray-70` these pairs also keep ≥ 4.5:1 contrast.
- `gray-40` only for placeholders and disabled: on `gray-90` it gives 4.4:1, right at the limit.
- `gray-60` and `gray-50` are for lines, never for text.

## System colors

Four muted, "organic" tones: slightly warm and less saturated than neon, so they don't hurt
the eyes in the dark. Each has three states: Default, Pressed, Disabled.

| Role | Default | Pressed | Disabled |
| --- | --- | --- | --- |
| **red**: error, critical | `red-default` #df746a | `red-pressed` #c15e55 | `red-disabled` #59413d |
| **orange**: attention | `orange-default` #ee9b58 | `orange-pressed` #cd8041 | `orange-disabled` #564335 |
| **green**: normal, success | `green-default` #79c68a | `green-pressed` #60a871 | `green-disabled` #3a4d3e |
| **blue**: information | `blue-default` #67b5e1 | `blue-pressed` #4f98c1 | `blue-disabled` #354b58 |

- **Default**: a fill with `gray-100` text on it (≥ 6:1), or the color of an icon and text on
  `gray-90` / `gray-80`.
- **Pressed**: one step darker than Default; `gray-100` text keeps ≥ 4.5:1.
- **Disabled**: almost gray, with a faint tint of its color. Text on it is `gray-40`. Low
  contrast here is intentional: it marks the inactive state.
- `red-default` is noticeably darker than `green-default` (6:1 vs 9:1 on `gray-90`), so
  "critical" and "normal" can be told apart by color-blind people too. Still, color must never
  be the only signal: always add an icon or a label.

### Mapping to the app's statuses (CONTRACT.md)

| Status | Label | Token |
|---|---|---|
| 🟢 green | Normal | `green-default` |
| 🟡 yellow | Attention | `orange-default` |
| 🔴 red | Act now | `red-default` |
| ⚪ grey | No data | `gray-40` (text/icon), `gray-60` (track) |
| info (neutral notices) | — | `blue-default` |

## Mood colors

Seven colors for the mood check-in on the Mind tab, one per valence step, ramp
purple → blue → turquoise → gold. Spec: [design/MOOD_CHECKIN_SPEC.md](../design/MOOD_CHECKIN_SPEC.md).

| Step | Token | HEX |
|---|---|---|
| Very Unpleasant | `mood-very-unpleasant` | #9a86e0 |
| Unpleasant | `mood-unpleasant` | #8d94e6 |
| Slightly Unpleasant | `mood-slightly-unpleasant` | #7ea7e6 |
| Neutral | `mood-neutral` | #67b5e1 (= `blue-default`) |
| Slightly Pleasant | `mood-slightly-pleasant` | #7fc4b8 |
| Pleasant | `mood-pleasant` | #e2b85e |
| Very Pleasant | `mood-very-pleasant` | #f2c75c |

- Use them only for mood, never for health statuses.
- Never use `orange-*` for mood: orange means "attention", and mood must not look like an alert.

## Typography

Fonts come from the NASA Space Apps brand. Both are free (SIL OFL) and load from Google Fonts.

- **Fira Sans** (Black 900, Bold 700): headings. `display` and `h1` in Black, `h2` and `h3` in Bold.
- **Overpass** (Regular 400, Bold 700, Italic): subheadings and body text.

| Style | Class in `tokens.css` | Font | Size / line height |
| --- | --- | --- | --- |
| display | `ds-display` | Fira Sans Black | 40 / 44 |
| h1 | `ds-h1` | Fira Sans Black | 32 / 38 |
| h2 | `ds-h2` | Fira Sans Bold | 24 / 30 |
| h3 | `ds-h3` | Fira Sans Bold | 20 / 26 |
| subtitle | `ds-subtitle` | Overpass Bold | 18 / 24 |
| subtitle-regular | `ds-subtitle-regular` | Overpass Regular | 18 / 24 |
| body | `ds-body` | Overpass Regular | 16 / 24 |
| body-bold | `ds-body-bold` | Overpass Bold | 16 / 24 |
| body-italic | `ds-body-italic` | Overpass Italic | 16 / 24 |
| caption | `ds-caption` | Overpass Regular | 13 / 18 |
| label | `ds-label` | Overpass Bold | 12 / 16 |

- Headings in `gray-10`, body text in `gray-20`, captions in `gray-30`.
- Use Fira Sans Black only for `display`, `h1` and big metric numbers (heart rate, SpO₂).

## Not defined yet

Spacing, radius, shadows and components are not part of the system yet. Until they are,
keep the values already used in the app and don't invent new ones.
