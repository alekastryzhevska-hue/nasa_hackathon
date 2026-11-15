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
- Mockup of all screens: [Astronaut Health — Main Screen](https://claude.ai/artifact/1uZvkHVUDCeeRWD2ZNrJsp).
- What has to change on the site: [design/DESIGN_UPDATE.md](design/DESIGN_UPDATE.md)
  (header, tabs Skeleton → Muscles → Organs → Cardio → Hydration → Sleep → Mind → Readiness,
  cards, fonts, figure per tab, interactive Organs, radiation "sensor not updating" state).
- Mind tab mood check-in: [design/MOOD_CHECKIN_SPEC.md](design/MOOD_CHECKIN_SPEC.md) +
  [design/mood-data.json](design/mood-data.json) (HealthKit State of Mind model).

## Assets and references
- _Links to mockups, Figma files, inspiration, icons, etc._

## Decision log

| Date | Author | Decision | Reason |
|------|--------|----------|--------|
| 2026-11-13 | alekastryzhevska-hue | Created this file to keep all design notes in one place. | Keep design separate from progress status. |
| 2026-11-15 | alekastryzhevska-hue | Added the WALL-E & EVE design system (colors, typography) to `design-system/`. | Backend can use the same tokens in the code. |
| 2026-11-15 | alekastryzhevska-hue | Design update from Claude Design (`design/DESIGN_UPDATE.md`): renamed tabs + new Readiness tab, app name "WALL-E & EVE :3", Organs reduced to brain & eyes, lungs, liver, kidneys. | Match the final mockup. |
| 2026-11-15 | alekastryzhevska-hue | Mind tab: 7-step mood check-in with HealthKit labels; 7 new `mood-*` tokens, no orange for mood. | Orange means "attention"; mood must not look like an alert. |
