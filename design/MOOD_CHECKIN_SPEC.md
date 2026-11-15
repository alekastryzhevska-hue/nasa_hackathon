# Mood check-in — "Mind" tab (formerly "Emotions")

Spec for the mood check-in screen in the WALL-E & EVE astronaut health app.
Data lives in `mood-data.json` (same folder). The model follows Apple HealthKit
"State of Mind" (`HKStateOfMind`), so the data can be mapped 1:1 if we ever sync
with HealthKit.

## Screen structure

1. **Selected state title**: the current step name in large type above the slider
   (e.g. "Pleasant").
2. **Valence slider**: 7 discrete steps, end labels
   "Very unpleasant" ↔ "Very pleasant".
3. **3D figure**: its color follows the selected step. Colored parts: silhouette,
   brain, nerve network, rings, pedestal. (No Apple-style circles or flowers.)
4. **Emotion chips** under the question "What best describes this feeling?"
   - multi-select, toggle on click
   - a "More" button reveals the rest of the group
5. **"Save check-in"** button at the bottom.

## Behavior

- Default state: step `pleasant` (gold), labels `happy` + `grateful` selected.
- The chip list depends on the slider's group:
  - steps 1–3 → `labelGroups.unpleasant` (20 labels)
  - step 4 → `labelGroups.neutral` (10 labels)
  - steps 5–7 → `labelGroups.pleasant` (17 labels)
- Moving the slider **into a different group** replaces the chip list and
  **clears the selected labels**. Moving within the same group keeps the selection.
- Only labels from the list can be chosen (no free text), same as Apple.
- Saving creates one check-in record (see below) and marks the "Mood check-in"
  task in the Daily plan as done.

## Saved record

```json
{
  "id": "uuid",
  "userId": "crew-member-id",
  "timestamp": "2026-11-15T07:00:00Z",
  "missionDay": 94,
  "valenceStep": "pleasant",
  "valence": 0.66,
  "labels": ["happy", "grateful"]
}
```

## Colors

- 7 new tokens `mood-*` for the WALL-E & EVE design system, one per step
  (see `valenceSteps[].colorToken` / `color` in the JSON).
- Ramp: purple → blue → turquoise → gold.
- `mood-neutral` = `blue-default` `#67B5E1`.
- **Orange from the design system is NOT used**: `orange-*` means "warning"
  in this app, so mood must not look like an alert.
- Colors are final and match
  the Claude Design mockup.

## HealthKit mapping (reference)

| Our `valenceStep` | HealthKit `ValenceClassification` |
|---|---|
| veryUnpleasant | `.veryUnpleasant` |
| unpleasant | `.unpleasant` |
| slightlyUnpleasant | `.slightlyUnpleasant` |
| neutral | `.neutral` |
| slightlyPleasant | `.slightlyPleasant` |
| pleasant | `.pleasant` |
| veryPleasant | `.veryPleasant` |

Label `id`s match HealthKit `HKStateOfMind.Label` case names (38 labels).

## Notes

- Apple does not publish which labels belong to each of the 7 steps; the 3-group
  split is our own decision. The neutral set is our selection based on Apple's
  examples and overlaps with the other two groups on purpose.
- Ukrainian titles (`titleUk`) are included for future localization.
