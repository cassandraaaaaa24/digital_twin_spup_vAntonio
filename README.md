# Digital Twin Resume — Tashanda Chealsy A. Antonio

An interactive, single-page web application that presents a professional resume with a tabbed interface, embedded profile card, and AI-powered chatbot for real-time resume inquiries.

---

## Project Overview

**Purpose:** Replace static PDF resumes with a dynamic, web-based digital presence  
**Features:**
- 📑 Five tabbed sections (Personal Data, Education, Certifications, Events, Affiliations)
- 💬 Fixed AI chatbot panel (bottom-right) with keyword-based or OpenAI-powered responses
- 🎨 Professional orange/white theme with smooth animations
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🔐 Privacy-first: no external analytics, secure API key management

**Tech Stack:** HTML5 · CSS3 · Vanilla JavaScript · Node.js · Express.js

---

## Repository Structure

```
digital_twin_resume/
├── README.md                      # This file (quick-start guide)
├── agents.md                      # Architecture, tech stack, conventions
├── index.html                     # Single-page app entry point
├── styles.css                     # All styling (650+ lines, responsive)
├── app.js                         # Frontend logic (tabs, chat, animations)
├── data.js                        # Resume data object (personal, education, certs, events, affiliations)
├── server.js                      # Express server (static serving, /api/chat endpoint)
├── package.json                   # Dependencies & npm scripts
├── package-lock.json              # Dependency lock file
├── .env.example                   # Template for environment variables (API keys)
├── .gitignore                     # Excludes secrets & node_modules/
├── docs/
│   └── prd.md                     # Product Requirements Document (features, requirements, acceptance criteria)
└── public/
    └── assets/
        └── images/
            └── TONG, GAB.png      # Profile picture (96x96px)
```

---

## Documentation

For detailed project information, see:

- **[docs/prd.md](docs/prd.md)** — Product Requirements Document
  - Functional Requirements (FR1–FR6)
  - Non-Functional Requirements (NFR1–NFR6)
  - Acceptance Criteria (AC1–AC8)
  - AI Study / Reference URLs

- **[agents.md](agents.md)** — Architecture & Technical Conventions
  - Complete tech stack breakdown
  - Code architecture (frontend, data, backend layers)
  - Naming conventions & best practices
  - Deployment & CI/CD guidance

---

## Quick Start

### Option A: Static Mode (No Backend, No AI)

Perfect for quick testing without Node.js setup:

1. Open `index.html` in your browser:
   - Double-click the file, or
   - Drag and drop into browser, or
   - Right-click → "Open with" → your browser

2. All tabs, personal data, events, and certifications will load.
3. Chatbot will use keyword-based matching (local fallback).

### Option B: Node Server Mode (Recommended)

Enables full AI integration and proper static file serving:

#### Prerequisites
- Node.js 16+ ([download](https://nodejs.org/))
- npm (comes with Node.js)

#### Setup

1. **Install dependencies:**
   ```bash
   cd "C:\Users\melch\OneDrive\Desktop\digital twin resume eca"
   npm install
   ```

2. **(Optional) Set up API keys:**
   ```bash
   copy .env.example .env
   ```
   
   Then edit `.env` with your keys:
   ```env
   OPENAI_API_KEY=sk-...your-openai-key-here...
   GROQ_API_KEY=...your-groq-key-here...
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Expected output:
   ```
   Server listening at http://localhost:3000
   ```

4. **Open in browser:**
   - Navigate to http://localhost:3000

#### Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `OPENAI_API_KEY` | OpenAI Chat API key | No | Local responder used |
| `GROQ_API_KEY` | GROQ/Sanity API key | No | Not used |
| `PORT` | Server port | No | 3000 |

> **⚠️ Security:** Store API keys in `.env` only. Never commit to version control. Use `.env.example` as a template.

---

## Features

### 📑 Tabbed Resume Interface
- **Personal Data** — Birth date, birthplace, gender, citizenship, religion, address, email
- **Education** — Degree, school, graduation year, capstone project, secondary & primary schooling
- **Certifications** — 32+ professional certifications and qualifications
- **Seminars & Events** — 21+ workshops, conferences, and seminars (with thumbnail images)
- **Affiliations** — Professional memberships and roles

### 💬 AI Chatbot
- **Fixed Position:** Bottom-right corner, always accessible
- **Smart Responses:**
  - Keyword-based matching (births, education, certifications, events, affiliations)
  - OpenAI integration (if `OPENAI_API_KEY` is set)
  - Fallback to local responder if API fails
- **UX:** Typing indicator, message history, smooth animations

### 🎨 Design
- **Color Scheme:** Orange (#ff6a00) and white
- **Animations:** Floating emojis, card transitions, chat fade-in
- **Responsive:** Mobile-optimized (stacking, scrollable tabs, full-screen chat)
- **Accessibility:** Semantic HTML, alt text, keyboard navigation

---

## How to Use

### As a Resume
1. Share the URL (when deployed) or send the local file
2. Click tabs to view different resume sections
3. Scroll within each section to see all content

### With the Chatbot
1. Click the 💬 button (bottom-right)
2. Type a question (e.g., "What's my degree?" or "List events")
3. Get instant answers from the chatbot

### Customization

To update resume content:
1. Edit `data.js` with new information
2. Restart server: `npm start` or reload browser
3. Git commit changes: `git add data.js && git commit -m "Update resume data"`

To change styling:
1. Edit `styles.css` (update colors, fonts, spacing)
2. Reload browser (Ctrl+Shift+R for hard refresh)
3. Git commit: `git add styles.css && git commit -m "Update styling"`

---

## Security & Privacy

✅ **What We Do Right:**
- No external analytics or trackers
- API keys stored in `.env` only (never in code)
- All data stays in the browser (no server logging)
- HTTPS ready (just deploy to HTTPS host)

⚠️ **What to Remember:**
- Never commit `.env` file to Git (it's in `.gitignore`)
- Keep `OPENAI_API_KEY` and other secrets private
- If sharing the repo, only `.env.example` is tracked

---

## Deployment

### Local
```bash
npm start   # Runs on http://localhost:3000
```

### Cloud (Example: Vercel, Heroku, Railway)
1. Set environment variables in your hosting dashboard (OPENAI_API_KEY, etc.)
2. Push to GitHub
3. Connect repository to hosting service
4. Deploy (automatic or manual)

For detailed deployment guidance, see [agents.md](agents.md#deployment--devops).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /" | Make sure Node server is running (`npm start`) |
| Images not loading | Check `public/assets/images/TONG, GAB.png` exists; use absolute paths in data.js |
| Chat not responding | Verify `.env` file exists; restart server; check browser console for errors |
| Port 3000 in use | Kill existing Node process: `Get-Process node \| Stop-Process -Force` (Windows) |
| API key errors | Copy `.env.example` to `.env`; add your actual keys; restart server |

---

## Project Links

- 🔗 **GitHub:** https://github.com/OoVTo/digital_twin_spup
- 📄 **Requirements (PRD):** [docs/prd.md](docs/prd.md)
- 🏗️ **Architecture (Agents):** [agents.md](agents.md)

---

## License & Credits

This digital twin resume was built for Tashanda Chealsy A. Antonio as a professional portfolio platform. 

**Technologies Used:**
- Free tier: HTML5, CSS3, JavaScript, Node.js, Express.js
- APIs: OpenAI Chat Completions (optional)
- Hosting: GitHub (code), local/cloud (deployment)

---

## Questions?

Refer to:
- **Setup:** This README (Quick Start section)
- **Features:** [docs/prd.md](docs/prd.md) (Functional Requirements)
- **Architecture:** [agents.md](agents.md) (Tech Stack & Conventions)
