# Architecture & Technical Agents
## Digital Twin Resume Platform

---

## Tech Stack

### Frontend
- **HTML5** — Semantic markup, accessible DOM structure
- **CSS3** — Grid, Flexbox, animations (@keyframes), custom properties (variables)
- **JavaScript (ES6+)** — Vanilla JS (no frameworks) for minimal bundle size
- **Google Fonts** — Inter typeface for typography
- **SVG Icons** — Inline SVGs for tab navigation (person, graduation, star, calendar, people)

### Backend
- **Node.js 16+** — Runtime environment
- **Express.js 4.x** — Lightweight server and middleware
- **Dotenv** — Environment variable management
- **Node-fetch** — HTTP client for OpenAI API calls

### External APIs
- **OpenAI Chat API (gpt-3.5-turbo)** — Optional AI responses (requires OPENAI_API_KEY)
- **Picsum.photos** — Placeholder event images (seeded by event index)

### Deployment
- **Git** — Version control
- **GitHub** — Remote repository
- **Local HTTP** — Development via `npm start` on localhost:3000

### Development
- **npm** — Package manager
- **Node.js** — Local development environment
- **VS Code** — Recommended IDE

---

## Architecture & Conventions

### Directory Structure
```
digital_twin_resume/
├── index.html              # Main HTML (single-page entry point)
├── styles.css              # All CSS (650+ lines, responsive breakpoints at 880px, 768px)
├── app.js                  # Frontend logic (tabs, chat, animations)
├── data.js                 # Resume data object (personal, education, certs, events, affiliations)
├── server.js               # Express server (static serving, /api/chat endpoint)
├── package.json            # Dependencies & npm scripts
├── package-lock.json       # Lock file for reproducible installs
├── .env.example            # Template for environment variables (OPENAI_API_KEY, GROQ_API_KEY)
├── .gitignore              # Excludes node_modules/, .env files
├── README.md               # Setup instructions
├── docs/
│   └── prd.md              # Product Requirements Document
├── agents.md               # This file (architecture & conventions)
└── public/
    └── assets/
        └── images/
            └── TONG, GAB.png    # Profile picture (96x96px)
```

### Code Architecture

#### Frontend Layer (app.js)
**Responsibility:** Render UI, handle user interaction, communicate with backend

**Key Functions:**
- `createTabs()` — Generate tab buttons with SVG icons
- `svgIcon(id)` — Return inline SVG markup for each tab (personal, education, etc.)
- `renderSection(id)` — Conditional rendering based on selected tab
- `appendMsg(name, text, isUser)` — Add message to chat log
- `showTyping()` — Display typing indicator
- `queryServer(message)` — Fetch `/api/chat` (async)
- `answerQuery(q)` — Local keyword-based fallback responder
- `ensurePanelVisible()` — Dynamically reposition chat panel to stay fully visible

**Event Handlers:**
- Tab click → renderSection()
- Chat toggle click → show/hide panel; ensurePanelVisible()
- Form submit → queryServer() or answerQuery()
- Window resize → ensurePanelVisible()

**Design Patterns:**
- **Conditional Rendering:** `renderSection(id)` uses switch/if statements to inject HTML per tab
- **Fallback Pattern:** Attempts server query; falls back to local responder if network error
- **DOM Manipulation:** innerHTML for dynamic content (safe here since no external user input)

#### Data Layer (data.js)
**Responsibility:** Centralized, immutable resume data

**Structure:**
```javascript
window.resumeData = {
  personal: { birthDate, birthplace, gender, citizenship, religion, address, email },
  education: { degree, school, years, capstone, SHS, JHS },
  certifications: ["Cert 1", "Cert 2", ...], // 32 items
  events: [{ title, venue, date, img }, ...], // 21 items
  affiliations: ["Role 1", "Role 2", ...], // 5 items
}
```

**Conventions:**
- All dates in "YYYY" or "Month DD, YYYY" format
- Image URLs are picsum.photos with seeded random IDs per event
- Email and address are plain strings
- No nested objects within arrays (flat structure for simplicity)

#### Backend Layer (server.js)
**Responsibility:** Serve static files, proxy API requests, provide fallback chat logic

**Endpoints:**
- `GET /` — Serve index.html
- `GET *` — Serve static files (CSS, JS, images) from project root
- `POST /api/chat` — Accept user message, return AI/local response

**Route Logic:**
```javascript
POST /api/chat {
  if (OPENAI_API_KEY is set) {
    fetch("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
  } else {
    return localAnswer(message); // keyword matching in server.js
  }
}
```

**Conventions:**
- Listens on port 3000 (or process.env.PORT)
- Async/await for all API calls
- JSON responses always include `reply` field: `{ reply: "..." }`
- Errors return `{ reply: "Sorry, I couldn't process that..." }`

### UI/UX Conventions

#### Color Scheme (CSS Variables)
```css
--accent: #ff6a00        /* Primary orange */
--accent-light: #ff8f3d  /* Secondary orange */
--bg: #fff7f2            /* Off-white background */
--card: #ffffff          /* White card background */
--muted: #d4d4d4         /* Gray for disabled/secondary */
--text: #1b1b1b          /* Near-black text */
```

#### Responsive Breakpoints
- **Desktop:** 1400px+ (full layout, adjacent sidebar + content)
- **Tablet:** 880px–1399px (sidebar above content; more compact)
- **Mobile:** <768px (full-width; tabs scroll; chat expands to fullscreen)

#### Component Classes
- `.personal-card` — Profile card with avatar + grid fields (2 columns on desktop, 1 on mobile)
- `.event-card` — Event with image, title, venue, date
- `.cert-item` — Certificate list item
- `.chat-panel` — Fixed positioned message container
- `.chat-toggle` — Fixed button to open/close panel
- `.msg` — Message wrapper
- `.msg.user`, `.msg.bot` — Message variants
- `.typing` — Typing indicator animation

#### Animation Conventions
- `@keyframes floatEmoji` — Background emoji float; 12–20s cycle, infinite
- `@keyframes floaty` — Avatar lift; 6s cycle, infinite
- `@keyframes blink` — Typing indicator; 600ms cycle, infinite
- `@keyframes contentFade` — Tab content fade-in; 300ms
- Transitions: 0.3s ease for hover states; 0.15s for quick feedback

### Naming Conventions

**JavaScript:**
- camelCase for variables, functions: `renderSection()`, `chatPanel`, `isActive`
- CONSTANT_CASE for static values: `MAX_MSG_LENGTH`, `AVATAR_SIZE`
- Prefix boolean variables with `is`, `has`: `isOpen`, `hasError`

**CSS:**
- kebab-case classes: `.chat-panel`, `.event-card`, `.personal-card`
- BEM-inspired for variants: `.msg.user`, `.msg.bot` (not `.msg--user`, simpler)
- Custom properties (variables): `--accent`, `--bg`, `--text`

**HTML:**
- Semantic tags: `<header>`, `<main>`, `<footer>`, `<section>`, `<article>`
- data-* attributes for tab IDs: `data-tab="personal"` (if needed; currently className used)
- aria-* for accessibility: `aria-hidden="true"` on decorative emojis

### Error Handling & Defaults

**Frontend:**
- Network error in queryServer() → catchblock returns null → falls back to answerQuery()
- Chat input validation → trim whitespace; prevent empty sends
- Image load errors → show alt text or placeholder

**Backend:**
- Missing .env file → dotenv.config() silently continues; process.env.OPENAI_API_KEY is undefined
- OpenAI API error → catch block logs error, returns local response
- 500 errors → JSON response with error message

### Testing Conventions

**Manual Testing Checklist:**
- [ ] All tabs render on first load
- [ ] Chat panel opens/closes without layout shift
- [ ] Profile image loads correctly
- [ ] Keyword queries return expected responses
- [ ] Mobile view stacks properly at <768px
- [ ] CSS animations play smoothly (60fps target)
- [ ] Links to docs/prd.md and agents.md are working
- [ ] Server starts with `npm start` and listens on 3000

### Security Conventions

**Environment Variables:**
- All API keys (OPENAI_API_KEY, GROQ_API_KEY) stored in .env only
- .env is excluded in .gitignore
- .env.example provided as template with empty values
- No hardcoded URLs or secrets in code

**Input Validation:**
- User chat messages trimmed and length-checked (< 2000 chars recommended)
- No eval() or innerHTML injection from external sources
- OpenAI API calls include temperature 0.7 max for reliability

**CORS & Origin:**
- localhost:3000 only for development
- No automatic CORS headers (restricts to same origin)
- Production would require explicit CORS configuration

---

## References to Requirements

This document references the **Product Requirements Document (PRD)** located at:
- **[docs/prd.md](../docs/prd.md)**

The PRD details:
- **Functional Requirements (FR1–FR6):** Tabs, personal data, events, chatbot, keyword matching, API integration
- **Non-Functional Requirements (NFR1–NFR6):** Performance, accessibility, security, browser support, responsiveness, maintainability
- **Acceptance Criteria (AC1–AC8):** Testing checkpoints for final delivery

**How This Document Relates:**
- **agents.md** (this file) outlines *how* requirements are implemented (tech stack, architecture, conventions)
- **prd.md** states *what* should be built (features, constraints, acceptance criteria)
- **README.md** provides *quick start* instructions for setup and usage

### Key Features Mapped to Architecture

| Requirement | Tech Stack | Architecture |
|-------------|-----------|--------------|
| Tabbed interface (FR1) | HTML + CSS Grid + JS | createTabs() + renderSection() |
| Personal data display (FR2) | HTML + CSS Grid + data.js | .personal-card class + 2-col grid |
| Event images (FR3) | CSS + picsum.photos URLs | .event-card class + Flexbox |
| Chatbot panel (FR4) | HTML + CSS fixed + JS | .chat-panel + ensurePanelVisible() |
| Keyword responder (FR5) | JS regex + local fallback | answerQuery() + localAnswer() |
| API integration (FR6) | Express + Node-fetch | /api/chat endpoint + OpenAI proxy |

---

## Deployment & DevOps

### Local Setup
```bash
npm install         # Install dependencies
cp .env.example .env # Copy env template (optional, can run without it)
npm start           # Start server at http://localhost:3000
```

### Production Deployment
- Ensure OPENAI_API_KEY is set in production environment variables (not committed)
- Use HTTPS in production (HTTP only for localhost)
- Consider CDN for static assets if scale requires
- Monitor /api/chat endpoint for rate limits and errors

### CI/CD (Optional)
- Lint: `npm run lint` (if added to package.json)
- Test: `npm test` (if jest/tests added)
- Deploy on push to main: GitHub Actions suggested

---

## Future Enhancements (Out of Scope)

- [ ] Database integration for dynamic resume updates
- [ ] User authentication & multi-user support
- [ ] Dark mode toggle
- [ ] PDF export functionality
- [ ] Semantic search (GROQ/RAG integration)
- [ ] Real-time collaboration
- [ ] Analytics dashboard (privacy-respecting)

