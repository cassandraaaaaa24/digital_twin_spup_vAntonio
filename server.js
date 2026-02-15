require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = global.fetch || require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function localAnswer(message){
  const resume = require('./data.js').resumeData;
  const s = message.toLowerCase();
  if (/(birth|born|birthplace|birth date|birthday)/.test(s)) return `Birth Date: ${resume.personal.birthDate}; Birthplace: ${resume.personal.birthplace}`;
  if (/(email|e-mail|contact)/.test(s)) return `Email: ${resume.personal.email}; Address: ${resume.personal.address}`;
  if (/(degree|studying|education|capstone)/.test(s)) return `Degree: ${resume.education.degree} at ${resume.education.school} (${resume.education.years}). Capstone: ${resume.education.capstone}`;
  if (/list certifications/.test(s)) return resume.certifications.join('\n');
  if (/list events/.test(s)) return resume.events.map(e=>`${e.title} — ${e.date}`).join('\n');
  return null;
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'missing message' });

  // If OPENAI_API_KEY present, forward to OpenAI chat completion
  if (process.env.OPENAI_API_KEY) {
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'You are a helpful assistant for resume questions.' }, { role: 'user', content: message }],
          max_tokens: 500
        })
      });
      const j = await resp.json();
      const reply = j?.choices?.[0]?.message?.content || JSON.stringify(j);
      return res.json({ reply });
    } catch (err) {
      console.error('OpenAI error', err);
    }
  }

  // Try local answer
  const local = localAnswer(message);
  if (local) return res.json({ reply: local });

  return res.json({ reply: "No AI key configured. Set OPENAI_API_KEY to enable real AI responses, or ask simple resume queries." });
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
