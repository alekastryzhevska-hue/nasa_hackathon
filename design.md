# Design

All design information for the project lives here: visual style, UI/UX, layouts and
design decisions. Owned by design (alekastryzhevska-hue); backend suggestions go to
"Notes for partner" in STATUS.md. Record every change in the
Decision log.

## Visual style

Design system: **WALL-E & EVE** — full rules and tokens in
[design-system/README.md](design-system/README.md); CSS variables in
[design-system/tokens.css](design-system/tokens.css). Dark theme only.

### Colors
- Cool gray scale `gray-100` (darkest, #060c13) … `gray-0` (lightest, #f2f5f9), step 10.
- Layers: `gray-90` app background → `gray-80` cards → `gray-70` elements inside cards.
- Text: `gray-10` headings, `gray-20` body, `gray-30` secondary.
- System colors, each Default / Pressed / Disabled: red = Act now, orange = Attention,
  green = Normal, blue = information. Grey "No data" uses `gray-40`.
- Never use color as the only signal: always an icon or a label.

### Typography
- Fira Sans (Black 900, Bold 700) for headings and big metric numbers.
- Overpass (Regular, Bold, Italic) for subtitles and body text.
- 11 text styles (`display` … `label`), available as `ds-*` classes in `tokens.css`.

### Spacing and layout
- _Not defined yet._

## Components
- _Not defined yet._

## Screens / pages
- _Not defined yet._

## Assets and references
- _Links to mockups, Figma files, inspiration, icons, etc._

## Decision log

| Date | Author | Decision | Reason |
|------|--------|----------|--------|
| 2026-11-13 | alekastryzhevska-hue | Created this file to keep all design notes in one place. | Keep design separate from progress status. |
| 2026-11-15 | alekastryzhevska-hue | Added the WALL-E & EVE design system (colors, typography) to `design-system/`. | Backend can use the same tokens in the code. |
