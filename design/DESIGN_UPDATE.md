# Site design update — WALL-E & EVE :3

For zachtrenito (backend). All changes from Claude Design that need to move to the site.
Author: alekastryzhevska-hue (design), 2026-11-15.

- **Mockup (all screens):** [Astronaut Health — Main Screen](https://claude.ai/artifact/1uZvkHVUDCeeRWD2ZNrJsp)
- **Design system:** [WALL-E & EVE](https://claude.ai/artifact/C56Vt2UqkXN2DVxHhzFCPY)
- **Mood screen (data + logic):** [MOOD_CHECKIN_SPEC.md](MOOD_CHECKIN_SPEC.md) and [mood-data.json](mood-data.json) (in this folder)

> **What the site already does better than the mockup — DO NOT change:**
> - **Mission progress:** the site shows "Day 94 of 180 · Launch → Mars". This is right, because we only cover the transit. The mockup still has the old "Day 412 / 2 190"; don't copy it.
> - **Daily plan:** the site has tasks with captions ("Auto · 62 / 60 min from the exercise machine", "1.1 / 2.0 L"). Keep as is.
> - **Disclaimer at the bottom and "Test panel".** Keep.

---

## 1. Global changes (all screens)

### Header
- App name: **"Health app" → "WALL-E & EVE :3"** (Space Grotesk 700, 20px, `gray-10`). Remove the logo icon.
- Center switch: **"Main / Sport" → "Health / Workout"**.
  - Active button: fill `gray-20` #b2bbc8, text `gray-100` #060c13, weight 700.
  - Inactive: transparent, text `gray-20`, weight 500.
  - Height 52px, padding 0 44px, fully rounded.
- Header is a "pill": `border-radius: 100px`, background `gray-90`, `position: sticky; top: 8px`, 8px from the edges.
- User button on the right unchanged (avatar with initials, name, dropdown arrow).

### Body system tabs
Rename and add a new one:

| Was on the site | Now |
|---|---|
| Bones | **Skeleton** |
| Muscles | Muscles |
| Organs | Organs |
| Circulation | **Cardio** |
| Hydration | Hydration |
| Sleep | Sleep |
| Emotions | **Mind** |
| — | **Readiness** (new, last) |

- Active tab: fill `gray-20`, text `gray-100`, 600. Inactive: transparent, text `gray-30` #8e99a9, 500.
- Height 40px, padding 0 18px; the container is a pill with a `gray-60` border.
- Order: Skeleton → Muscles → Organs → Cardio → Hydration → Sleep → Mind → Readiness. The "Next: …" button in the status card goes to the next tab.

### Background and cards
- Page background: `gray-100` #060c13 with a dot grid: `radial-gradient(#1f2a38 1px, transparent 1.5px)`, `background-size: 24px 24px`.
- Left panels (Mission progress, Daily plan) and the Radiation block: background `gray-90`, `border-radius: 28px`, `opacity: 0.8`, no border.
- Status card next to the figure: background `gray-80` #151e29, border `gray-60`, `border-radius: 20px`, padding 24px.

### Fonts
- **Space Grotesk** (500/600/700): headings, big numbers, app name.
- **Inter** (400/500/600): body text.
- **IBM Plex Mono** (500): small uppercase captions ("MISSION PROGRESS", "DAILY PROGRESS") and values on the radiation scale. Letter-spacing 0.14em, uppercase, 12px, `gray-30`.

### 3D figure (shared by all tabs)
- The same silhouette on every tab, line-art hologram style, color `blue-default` #67b5e1 (strokes at 0.35–0.6 opacity).
- Around it two circles (solid and dashed, `gray-60`) and tick marks (`gray-50`).
- Under the feet a "pedestal": two `blue-default` ellipses.
- Each tab highlights its own system (see section 2).
- Figure height about 540px, centered, to the left of the status card.

### Status card (standard for all tabs)
1. 44px circle icon + 30px Space Grotesk title: "All good" (`green-default` #79c68a) or "Needs attention" (`orange-default` #ee9b58).
2. List of 3 metrics: name on the left, status with an icon on the right (✓ Normal / ⚠ Warning).
3. Advice (18px, `gray-20`).
4. Button "Next: <next tab> →": `blue-default`, text `gray-100`, height 56px.

---

## 2. Tabs: what to show

| Tab | Highlighted on the figure | Metrics in the card | Next |
|---|---|---|---|
| **Skeleton** | skeleton: skull, spine (dashed), ribs, pelvis, arm and leg bones, joints as circles | — (for now "All good" + advice) | Muscles |
| **Muscles** | muscle groups (shoulders, chest, abs, arms, thighs, calves), `blue-default` fill at 16% | Upper body · Core · Legs | Organs |
| **Organs** | brain and eyes, lungs, liver, kidneys (interactive, see section 3) | metric cards per organ | Cardio |
| **Cardio** | heart + main vessels, a horizontal ECG line at chest level | Heart rate · Blood pressure · Heart rhythm | Hydration |
| **Hydration** | figure "filled with water": `blue-default` gradient from the water line down, a wave on the surface, a few bubbles, a drop icon | Water intake · Electrolytes · Urine output | Sleep |
| **Sleep** | figure as a "battery": 10 bars, 7 filled (70%), caption "70% energy charge", battery "cap" above the head | Sleep duration · Sleep quality · Circadian rhythm + "Sleep debt · this week" block | Mind |
| **Mind** | brain + nerve network, color follows the mood (see section 4) | check-in screen instead of the status card | Readiness |
| **Readiness** | **no mockup yet**, keep a placeholder | — | → go to Workout |

### Sleep: "Sleep debt" block
- Background `gray-70`, `border-radius: 16px`.
- Title "SLEEP DEBT · THIS WEEK" (Plex Mono), big value "3 h 40 min".
- Mini histogram Mon–Sun: `blue-default` bars; days without a deficit are gray (`gray-60`, 4px high).
- Advice: "Keep your sleep window steady tonight".

---

## 3. Organs — interactive figure

The site currently shows the wrong organs on the figure. Replace them.

**Organs on the figure (only these 4):**
1. **Brain & eyes**: brain inside the skull + two eyes
2. **Lungs**: two lobes in the chest
3. **Liver**: upper right abdomen (on the viewer's left), under the diaphragm
4. **Kidneys**: two "beans" at the level of the lower ribs, on both sides of the spine

- Heart: only a thin `gray-50` outline, not highlighted (it belongs to Cardio).

**Statuses and interaction:**
- Next to each organ a status circle: ✓ green (`#79c68a`) or ⚠ orange (`#ee9b58`).
- A thin line from the organ to a label button "Kidneys · Normal".
- Hover or click on an organ: it glows stronger in `blue-default`, the others dim to `gray-50`.
- Click scrolls the right column to that organ's cards.

**Right column (scrolls, max-height ~640px):**
1. Summary: "All good" / "Needs attention" + advice + "Next: Cardio".
2. Card groups per organ:

| Organ | Metrics |
|---|---|
| Brain & eyes | Intraocular pressure (mmHg) · Optic disc swelling (grade) |
| Lungs | SpO₂ (%) · Respiratory rate (breaths/min) |
| Liver | Liver enzymes (ALT) (U/L) |
| Kidneys | Urine calcium (mg/day) · Urine output (mL/day) |

**"kidneyWarning" state** (for the demo):
- Kidneys orange, selected automatically, column scrolled to them.
- "Urine calcium" card with a 2px orange border, status "Above target", note: "Above target range — raises kidney-stone risk. Drink more water today."
- Summary: "Needs attention" · "Kidneys: urine calcium is above target. Drink more water and log your fluid intake."

> Organs on the site currently include "Body temperature" and "Blood sugar". Move temperature out (it isn't about organs); "Blood sugar" can stay under Liver.

---

## 4. Mind — mood check-in (replaces Emotions)

Full logic in [MOOD_CHECKIN_SPEC.md](MOOD_CHECKIN_SPEC.md), data in [mood-data.json](mood-data.json). In short:

- Card on the right: "How do you feel right now?" + a calendar button (mood history).
- Big state name in the center, its color = the state's color.
- 7-step slider (Very unpleasant ↔ Very pleasant); the track is a gradient of all 7 colors.
- "What best describes this feeling?": emotion chips. A selected chip is filled with the state's color, text `gray-100`.
- Moving the slider into another group (unpleasant / neutral / pleasant) changes the chip list and clears the selection.
- "Save check-in" button.
- **The figure takes the state's color:** silhouette, brain, nerve network (lines and nodes from the brain down the body), rings around the head, pedestal, soft glow around the body.
- Default: Pleasant (#E2B85E), with Happy + Grateful selected.

> The mockup has no "More" button yet; all chips of the group are shown. If you add "More" (first 10 + the rest), that's fine too.

**Mood colors (new `mood-*` tokens, added to `design-system/tokens.css`):**

| State | Token | HEX |
|---|---|---|
| Very Unpleasant | `mood-very-unpleasant` | #9A86E0 |
| Unpleasant | `mood-unpleasant` | #8D94E6 |
| Slightly Unpleasant | `mood-slightly-unpleasant` | #7EA7E6 |
| Neutral | `mood-neutral` | #67B5E1 (= blue-default) |
| Slightly Pleasant | `mood-slightly-pleasant` | #7FC4B8 |
| Pleasant | `mood-pleasant` | #E2B85E |
| Very Pleasant | `mood-very-pleasant` | #F2C75C |

---

## 5. Radiation — new "sensor not updating" state

The normal state on the site already matches the mockup. Add the state for when the sensor sends no data for more than 30 min:

- Above the "Radiation" title, status "⚠ Elevated" (orange).
- Instead of "Live · updated 3 s ago": an orange dot without pulsing + "No update for 34 min".
- Scale marker: dashed frame, `gray-30` text: "Last reading · 1.8 mSv/day · 34 min ago"; the pointer is a dashed line.
- Under the scale a divider and text (`orange-default`, 17px): "The radiation sensor has not sent data for 34 minutes. The current radiation level is unknown."
- "What to do" (numbered list):
  1. Check that the ship's radiation sensor is powered on and connected.
  2. If there is still no data after 2 hours, connect your personal dosimeter by USB.
  3. Until data returns, know the way to the storm shelter.
- Button on the right: "Connect personal dosimeter" (background `gray-70`, border `gray-50`).

---

## 6. Design system tokens

```css
:root {
  /* neutrals */
  --gray-100: #060c13; --gray-90: #0d141e; --gray-80: #151e29; --gray-70: #1f2a38;
  --gray-60: #323e4e;  --gray-50: #4b596b; --gray-40: #6b798a; --gray-30: #8e99a9;
  --gray-20: #b2bbc8;  --gray-10: #d6dbe3; --gray-0: #f2f5f9;
  /* status (default / pressed / disabled) */
  --red-default: #df746a;    --red-pressed: #c15e55;    --red-disabled: #59413d;
  --orange-default: #ee9b58; --orange-pressed: #cd8041; --orange-disabled: #564335;
  --green-default: #79c68a;  --green-pressed: #60a871;  --green-disabled: #3a4d3e;
  --blue-default: #67b5e1;   --blue-pressed: #4f98c1;   --blue-disabled: #354b58;
  /* mood */
  --mood-very-unpleasant: #9a86e0; --mood-unpleasant: #8d94e6; --mood-slightly-unpleasant: #7ea7e6;
  --mood-neutral: #67b5e1; --mood-slightly-pleasant: #7fc4b8; --mood-pleasant: #e2b85e; --mood-very-pleasant: #f2c75c;
}
```

**Rules:**
- Red, orange and green are only for health statuses. Always with an icon or a label, never color alone.
- Do not use orange for mood: in this app it means "attention".
- Depth comes from gray layers (`gray-90` → `gray-80` → `gray-70`), not shadows.

---

## Checklist

- [ ] Header: name, Health / Workout, sticky pill
- [ ] Tabs: rename, add Readiness, Next buttons
- [ ] Dot-grid background, card styles, fonts
- [ ] Figures for Skeleton, Muscles, Cardio, Hydration, Sleep
- [ ] Organs: 4 organs, interaction, cards per organ, kidneyWarning state
- [ ] Mind: mood check-in per `MOOD_CHECKIN_SPEC.md`
- [ ] Radiation: "sensor not updating" state
- [ ] Tokens, including `mood-*`
- [ ] Readiness: placeholder for now (design comes later)
