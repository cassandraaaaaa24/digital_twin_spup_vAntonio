# Digital Twin Resume — Jacinto Gabriel A. Tong

This is a small static frontend that presents a tabbed "digital twin" resume and a left-side AI-like chatbot (keyword-based) that can answer questions about the resume.

Files:
- `index.html` — main page
- `styles.css` — styles
- `app.js` — tab rendering and chatbot logic
- `data.js` — the resume data and placeholder images for events


How to run (static only):

Option A — open locally (quick):
1. Open `index.html` in a browser (double-click or use "Open File" in your browser).

Option B — run the bundled Node server (recommended to enable AI chat):
1. Install dependencies:

```bash
cd "C:\Users\melch\OneDrive\Desktop\digital twin resume eca"
npm install
```

2. Copy `.env.example` to `.env` and set your keys. Do NOT commit `.env`.

Example (Windows PowerShell):

```powershell
copy .env.example .env
$env:OPENAI_API_KEY = "<your-openai-key>"
$env:GROQ_API_KEY = "<your-groq-or-sanity-key>"
npm start
```

Or using Command Prompt:

```cmd
copy .env.example .env
set OPENAI_API_KEY=<your-openai-key>
set GROQ_API_KEY=<your-groq-key>
npm start
```

3. Open http://localhost:3000

Security notes:
- Do NOT commit API keys into the repository. Use the `.env` file or a secrets manager.
- The provided backend will use `OPENAI_API_KEY` to call OpenAI. If not set, the server falls back to a local keyword responder.

