# Product Requirements Document (PRD)
## Digital Twin Resume — Jacinto Gabriel A. Tong

---

## Product Requirements

### Overview
A professional, interactive digital resume platform that showcases user credentials through a tabbed interface with an AI-powered chatbot for real-time resume inquiries. The platform replaces static PDF resumes with a dynamic, web-based presentation.

### Target Users
- Job seekers and professionals
- Hiring managers and recruiters
- Educational institutions

### Core Value Proposition
- **Interactive Resume:** Tab-based navigation for different resume sections
- **AI Assistant:** Real-time questions answered via keyword matching or AI models
- **Professional Design:** Modern orange/white theme with animations
- **Single-Page Experience:** No external scrolling; internal scroll-only content areas
- **Privacy-Focused:** All data stored locally; no external analytics

---

## AI Study / Reference URLs

### Frontend Frameworks & Design
- [Inter Font Family](https://fonts.google.com/specimen/Inter)
- [CSS Grid & Flexbox Best Practices](https://www.w3.org/TR/css-grid-1/)
- [Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)

### Chatbot & NLP
- [OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat/create)
- [Keyword Extraction & Matching](https://en.wikipedia.org/wiki/Keyword_extraction)
- [Regex Patterns for Intent Matching](https://regex101.com/)

### Deployment & Hosting
- [Express.js Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Node.js Static File Serving](https://nodejs.org/en/docs/guides/nodejs-web-servers/)
- [Environment Variables Best Practices](https://12factor.net/config)

---

## Functional Requirements

### FR1: Tabbed Resume Interface
- **Description:** Display resume sections in separate tabs
- **Tabs Required:**
  - Personal Data
  - Educational Background
  - Certifications
  - Seminars / Workshops / Conferences
  - Affiliations
- **Acceptance:** All tabs load without page reload; selected tab is visually highlighted

### FR2: Personal Data Section
- **Description:** Display personal information with profile card
- **Fields Required:**
  - Profile picture (TONG, GAB.png)
  - Name and degree
  - Birth date, birthplace, gender, citizenship, religion, address
  - Email contact
- **Acceptance:** Avatar displays correctly; grid layout adjusts on mobile

### FR3: Event Display with Images
- **Description:** Show seminars, workshops, and conferences with placeholder images
- **Details:** Event title, venue, date, and associated image
- **Acceptance:** Images load from picsum.photos; events have hover animation

### FR4: AI Chatbot Interface
- **Description:** Fixed chatbot panel on bottom-right corner
- **Features:**
  - Toggle open/close button
  - Message log with user/bot distinction
  - Typing indicator
  - Input field and send button
- **Acceptance:** Panel opens above chat button; stays fully visible on all screen sizes

### FR5: Keyword-Based Chatbot Responder
- **Description:** Local chatbot that answers resume questions
- **Queries Covered:**
  - Birth information
  - Education and degree
  - Certifications and events
  - Affiliations and memberships
- **Acceptance:** Responds accurately to keyword matches; fallback message for unknown queries

### FR6: Server-Side API Integration
- **Description:** Backend `/api/chat` endpoint for AI responses
- **Behavior:**
  - Falls back to local responder if no API key
  - Supports OpenAI API when `OPENAI_API_KEY` is set
- **Acceptance:** Requests to `/api/chat` return JSON with `reply` field

---

## Non-Functional Requirements

### NFR1: Performance
- **Page Load Time:** < 2 seconds on broadband (1 Mbps)
- **Chat Response Time:** < 1 second for local responses; < 3 seconds for AI responses
- **Bundle Size:** CSS + JS < 100 KB gzipped

### NFR2: Accessibility
- **WCAG 2.1 Level AA Compliance**
- Alt text on all images
- Keyboard navigation support
- Sufficient color contrast (4.5:1 for text)

### NFR3: Security
- **No API Keys in Code:** Environment variables only
- **HTTPS Only:** On production
- **Input Validation:** All user inputs sanitized
- **No External Analytics:** Privacy-first approach

### NFR4: Browser Compatibility
- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

### NFR5: Responsiveness
- Desktop: 1400px+ width
- Tablet: 768px–1399px width
- Mobile: < 768px width
- Layout reflow for all breakpoints

### NFR6: Maintainability
- Single-page structure for ease of deployment
- Clear file organization (docs/, public/assets/)
- Modular JavaScript (separate app.js, data.js)
- .gitignore for secrets and dependencies

---

## Acceptance Criteria

### AC1: Tab Navigation
- [ ] All 5 tabs render without errors
- [ ] Clicking a tab displays the correct section
- [ ] Active tab is visually highlighted
- [ ] Tabs reflow to horizontal scrollable on mobile

### AC2: Personal Data Display
- [ ] Avatar image (TONG, GAB.png) displays at 96x96px
- [ ] Personal fields display in a 2-column grid
- [ ] Fields are labeled and values visible
- [ ] Mobile view stacks fields in single column

### AC3: Event Cards
- [ ] All 21+ events render with image, title, venue, date
- [ ] Images fade in on scroll
- [ ] Hover effect adds shadow and lift
- [ ] Responsive: images scale on mobile

### AC4: Chatbot Functionality
- [ ] Chat button opens panel without breaking layout
- [ ] Panel stays visible; no clipping on any screen size
- [ ] User messages align right; bot messages align left
- [ ] Typing indicator appears while waiting
- [ ] Send button disabled while awaiting response

### AC5: Keyword Matching
- [ ] "What's my degree?" returns correct degree info
- [ ] "List events" returns 21+ event titles
- [ ] "List certifications" returns all 32 certifications
- [ ] Unknown queries return helpful fallback message

### AC6: Server & Static Files
- [ ] `npm install` installs all dependencies
- [ ] `npm start` launches server at http://localhost:3000
- [ ] http://localhost:3000 loads index.html without 404
- [ ] Static files (CSS, JS, images) serve correctly
- [ ] `/api/chat` endpoint responds with JSON

### AC7: Environment & Security
- [ ] `.env` file is in `.gitignore`
- [ ] `.env.example` provides template; no real keys present
- [ ] Server doesn't crash if env var is missing
- [ ] Local responder works without API key

### AC8: Design & UX
- [ ] Orange (#ff6a00) and white theme consistent
- [ ] No external page scrolling; internal scroll only
- [ ] Floating emojis animate smoothly in background
- [ ] Font size is readable on mobile (14px+)
- [ ] Button hovers have smooth transitions

#### Deployment Success Criteria
- [ ] GitHub repo pushed and accessible
- [ ] All files committed with meaningful messages
- [ ] README.md has clear setup instructions
- [ ] docs/prd.md and agents.md are linked and readable
- [ ] Project runs locally without modification

