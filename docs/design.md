# Design — Digital Twin Resume

_AI-generated from Week 1 PRD (authoring: automated synthesis)._ 

## Summary

This design document translates the PRD into an implementation-ready architecture and UI specification for the Digital Twin Resume web app. It covers components, data shapes, APIs, UI behavior, accessibility, and acceptance criteria so another developer can build the product without ambiguity.

## Goals (mapped to PRD)
- FR1: Tabbed resume interface (Personal, Education, Certifications, Events, Affiliations)
- FR2: Personal data presentation with profile card
- FR3: Event cards with picsum.photos placeholders
- FR4: Fixed chatbot panel with toggle and typing indicator
- FR5: Local keyword responder + optional OpenAI proxy `/api/chat`
- NFRs: performance, accessibility, security, maintainability

## High-level architecture

- Frontend: static single-page app (index.html, styles.css, app.js, data.js)
- Backend: Express server (server.js) serving static assets + `/api/chat` proxy
- Data: `window.resumeData` in `data.js` (immutable at runtime)
- Deployment: host static files on any static host or run Node/Express for API proxy

Component diagram (conceptual):

- Browser —> index.html
  - UI (Tabs, Chat Panel)
  - app.js reads `data.js`
- Server (Express)
  - Serves static files
  - POST /api/chat -> OpenAI (if key) OR local responder

## Data model (developer-ready)

resumeData (object) — required fields:
- personal: { name, degree, birthDate, birthplace, gender, citizenship, religion, address, email, avatar }
- education: [{ degree, school, years, capstone }]
- certifications: [string] (32 items expected)
- events: [{ title, venue, date, img }] (21+ items expected)
- affiliations: [string]

Conventions:
- Dates: `YYYY` or `Month DD, YYYY`
- Images: `https://picsum.photos/seed/{index}/400/240`

## UI Specification

- Global layout: single-page with internal scrolling areas for content. No outer page scroll (except small devices where necessary).
- Tabs: visible across top/left depending on breakpoint. Active tab highlighted using `--accent` color (#ff6a00).
- `personal-card`: 2-column grid on desktop; stacks on mobile.
- `event-card`: image (left or top), title, venue, date; hover lifts card with subtle shadow.
- `chat-panel`: fixed bottom-right; toggle button shows/hides panel; typing indicator uses `.typing` animation; messages contain `.msg.user` and `.msg.bot` variants.

Interaction details:
- Tab switch: update DOM via `renderSection(id)`; animate content fade-in (`contentFade`, 300ms).
- Chat input: trim whitespace; reject empty messages; disable send while awaiting response.
- Local responder: regex-based intent matching; fallback friendly message with suggestions.

## API

- POST /api/chat
  - Request: `{ message: string }`
  - Response: `{ reply: string }`
  - Behavior: if `process.env.OPENAI_API_KEY` present, forward to OpenAI Chat Completions (model config in server.js). Otherwise call `localAnswer(message)`.

Security & env:
- Do not commit API keys. Use `.env` (ignored by `.gitignore`) and provide `.env.example`.

## Accessibility

- All images include `alt` text.
- Keyboard navigation: tabs and chat input accessible via `Tab` and `Enter`.
- Color contrast: ensure text uses at least 4.5:1 contrast against background.

## Acceptance Criteria Mapping

- See PRD AC1–AC8. Implementers must verify each AC with manual test steps (listed in the PRD). This design contains UI element names and class names that map to ACs to make testing deterministic.

## Implementation notes & constraints

- Keep JS modular: `createTabs()`, `renderSection()`, `queryServer()`, `answerQuery()`.
- Keep `data.js` flat and immutable at runtime.
- Use `picsum.photos` seeded URLs for event images.
- Performance: minimize DOM updates and keep CSS+JS under targeted sizes.

## Team review & evidence

This file must be reviewed in a pull request. Evidence checklist to attach to PR:
- Commit(s) showing `docs/design.md` addition
- PR discussion or code review comments referencing acceptance criteria
- A screenshot of this file open in GitHub UI (URL + timestamp) attached to PR

Use the included checklist in `docs/implementation-plan.md` to record reviewer names, review comments, and timestamps.

## "Can another developer build this?" checklist
- [ ] `index.html`, `styles.css`, `app.js`, `data.js`, `server.js` present and runnable
- [ ] `npm install` && `npm start` ≈ runs server at http://localhost:3000
- [ ] `/api/chat` returns `{ reply }` for a test message
- [ ] All 5 tabs render with sample data from `data.js`

---
Generated: automated synthesis from `docs/prd.md` — update as team decisions evolve.
