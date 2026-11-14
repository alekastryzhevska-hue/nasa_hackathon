# Instructions for Claude

Two people build this project, each with their own Claude. This repository holds the
app code and the notes the two Claudes use to stay in sync. Follow these rules in every
session.

## Who is who

| GitHub login | Role | Owns |
|---|---|---|
| `alekastryzhevska-hue` | Design (Figma / Claude Design mockups) | `design.md`, mockup screenshots in `design/` |
| `zachtrenito` | Backend + building the UI from the mockups | `docs/health-rules.md`, all of `src/` |

- Identify the current user with `gh api user --jq .login`.
- **If the login is `chumasov`**, stop: that is an old account of `zachtrenito` with no access.
  Ask the user to run `gh auth switch` to `zachtrenito`.
- Neither person writes code themselves; Claude does. Explain changes by what they will
  see on screen and how to check it.

## Language

- Everything in the repository is in English: `.md` files, code comments, commit
  messages, and all text shown in the app.
- Chat with the user in their own language.

## Files

| File | What goes in it | Who edits |
|---|---|---|
| `PLAN.md` | Hackathon plan, scope, schedule, "Where we stopped" | Both |
| `STATUS.md` | Progress per person | Each only their own section |
| `CONTRACT.md` | Plain-language agreement: what each screen block shows and where data comes from | Change only after both agree |
| `docs/contract-technical.md` | Exact data formats; must match `CONTRACT.md` | Claude, after `CONTRACT.md` changes |
| `docs/health-rules.md` | Metrics, thresholds, advice texts | Backend |
| `design.md` | Visual style, layouts, design decisions | Design |
| `README.md` | Project description for the jury | Both, at the end |

Code layout:

| Folder | What | Who edits |
|---|---|---|
| `src/data/` | Data formats and the mock data generator | Backend |
| `src/rules/` | Statuses and advice, following `docs/health-rules.md` | Backend |
| `src/components/`, `src/*.css` | Screens and styling, built from design's screenshots | Backend (zachtrenito) |
| `src/App.tsx` | Puts everything together | Backend (zachtrenito) |
| `src/dev/` | Developer test panel (sliders, solar event) | Backend |

Design sends mockups as screenshots; zachtrenito's Claude turns them into code. Design
changes requests in "Notes for partner" or `design.md`.

Do not edit files owned by the partner. If a change there is needed, write it in
"Notes for partner" in `STATUS.md`. Design suggestions from backend also go there, not
into `design.md`.

## Working with git

- Work only in `main`. No other branches.
- **Before any work:** `git pull`.
- **After every working step:** commit with a short English message and `git push`.
  Small, frequent commits.
- If the push is rejected: `git pull --rebase`, then push again.
  - Conflict in a `.md` notes file: keep both people's text.
  - **Conflict in code: stop and explain it to the user.** Do not guess.
- Never use `git push --force` and never rewrite history.
- No passwords, keys or tokens in the repository. It will become public for submission.

## At the start of every session

1. `git pull`.
2. Read `PLAN.md`, `STATUS.md`, `CONTRACT.md`; read `design.md` or
   `docs/health-rules.md` when the task touches them.
3. Briefly tell the user what the partner did since their last update.

## After finishing work (or when the user asks to update the status)

1. `git pull`.
2. Update **only the current user's section** in `STATUS.md`: move finished items to
   "Done" with the date (YYYY-MM-DD), keep "In progress" and "Next" current, update
   "Last updated".
3. Update the "Where we stopped" section in `PLAN.md`.
4. Design work → record it in `design.md` (section + Decision log with date and author).
5. Commit (`status: <login> - <what changed>`) and push.
