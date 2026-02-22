require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const { Index } = require('@upstash/vector');
const app = express();
const port = process.env.PORT || 3000;

// Path for storing interview results
const interviewHistoryFile = path.join(__dirname, '_interview_history.json');

function loadInterviewHistory() {
  try {
    if (fs.existsSync(interviewHistoryFile)) {
      const data = fs.readFileSync(interviewHistoryFile, 'utf8');
      return JSON.parse(data) || [];
    }
  } catch (error) {
    console.error('Error loading interview history:', error.message);
  }
  return [];
}

function saveInterviewHistory(interviews) {
  try {
    fs.writeFileSync(interviewHistoryFile, JSON.stringify(interviews, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving interview history:', error.message);
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize Upstash Vector client (if configured)
let upstashIndex = null;
if (process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
  upstashIndex = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });
  console.log('✅ Upstash Vector Database connected');
}

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function localAnswer(message){
  const resume = require('./data.js').resumeData;
  const s = message.toLowerCase();
  if (/(birth|born|birthplace|birth date|birthday)/.test(s)) return `I was born on ${resume.personal.birthDate} in ${resume.personal.birthplace}.`;
  if (/(email|e-mail|contact)/.test(s)) return `You can reach me at ${resume.personal.email}. I'm based in ${resume.personal.address}.`;
  if (/(degree|studying|education|capstone)/.test(s)) return `I'm pursuing a ${resume.education.degree} at ${resume.education.school} (${resume.education.years}). My capstone project is "${resume.education.capstone}".`;
  if (/list certifications/.test(s)) return `I have ${resume.certifications.length} certifications:\n\n${resume.certifications.map((c, i) => `${i + 1}. ${c.title} — ${c.org} (${c.date})`).join('\n')}`;
  if (/list events/.test(s)) return `I've attended ${resume.events.length} events:\n\n${resume.events.map(e => `${e.title} at ${e.venue} (${e.date})`).join('\n')}`;
  return null;
}

/**
 * Helper function to get text from ID (reconstruct from data.js)
 */
function getTextFromId(id) {
  const resume = require('./data.js').resumeData;
  const [category, key] = id.split('_');
  
  if (category === 'personal') {
    const value = Object.entries(resume.personal).find(([k]) => k.toLowerCase() === key)?.[1];
    if (value) return `Personal: ${key} - ${value}`;
  }
  if (category === 'education') {
    const value = Object.entries(resume.education).find(([k]) => k.toLowerCase() === key)?.[1];
    if (value) {
      // Handle nested objects (shs, jhs)
      if (typeof value === 'object') {
        return `Education: ${key} - ${value.school || ''} (${value.years || ''})`;
      }
      return `Education: ${key} - ${value}`;
    }
  }
  if (category === 'cert') {
    const index = parseInt(key);
    const cert = resume.certifications[index];
    if (cert) return `Certification: ${cert.title} from ${cert.org} (${cert.date})`;
  }
  if (category === 'event') {
    const index = parseInt(key);
    if (resume.events[index]) return `Event: ${resume.events[index].title} at ${resume.events[index].venue} on ${resume.events[index].date}`;
  }
  if (category === 'affiliation') {
    const index = parseInt(key);
    const aff = resume.affiliations[index];
    if (aff) return `Affiliation: ${aff.role} at ${aff.organization} (${aff.period})`;
  }
  return null;
}

/**
 * Semantic search via Upstash Vector + local fallback
 */
app.post('/api/search', async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'missing query' });

  const results = [];

  // If Upstash is configured, attempt semantic search
  if (upstashIndex) {
    try {
      // Query Upstash Vector using the data string (Upstash handles embedding)
      const upstashResults = await upstashIndex.query(
        {
          data: query,
          topK: 5,
          includeMetadata: true
        }
      );

      upstashResults.forEach(result => {
        const text = getTextFromId(result.id);
        results.push({
          id: result.id,
          score: result.score,
          text: text || 'Resume data',
          category: result.metadata?.category
        });
      });
    } catch (error) {
      console.error('Upstash search error:', error.message);
      // Fall through to local search
    }
  }

  // Fallback: local keyword-based search
  if (results.length === 0) {
    const resume = require('./data.js').resumeData;
    const q = query.toLowerCase();
    const localResults = [];

    // Simple keyword matching across resume
    if (/(cert|qualification|credential)/.test(q)) {
      resume.certifications.slice(0, 5).forEach((cert, i) => {
        localResults.push({
          id: `cert_${i}`,
          score: 0.95,
          text: cert,
          category: 'certifications'
        });
      });
    }

    if (/(event|conference|workshop|seminar)/.test(q)) {
      resume.events.slice(0, 5).forEach((evt, i) => {
        localResults.push({
          id: `event_${i}`,
          score: 0.90,
          text: `${evt.title} at ${evt.venue}`,
          category: 'events'
        });
      });
    }

    if (/(education|degree|school|university)/.test(q)) {
      localResults.push({
        id: 'education_degree',
        score: 0.92,
        text: `${resume.education.degree} at ${resume.education.school}`,
        category: 'education'
      });
    }

    if (/(affiliation|member|organization|group)/.test(q)) {
      resume.affiliations.slice(0, 3).forEach((aff, i) => {
        localResults.push({
          id: `affiliation_${i}`,
          score: 0.88,
          text: aff,
          category: 'affiliations'
        });
      });
    }

    // If no category matches, do generic text search
    if (localResults.length === 0) {
      Object.entries(resume.personal).forEach(([key, val]) => {
        if (val && val.toLowerCase().includes(q)) {
          localResults.push({
            id: `personal_${key}`,
            score: 0.80,
            text: `${key}: ${val}`,
            category: 'personal'
          });
        }
      });
    }

    results.push(...localResults);
  }

  return res.json({
    query,
    results: results.slice(0, 5),
    total: results.length,
    source: results.length > 0 && results[0].score > 0.9 ? 'upstash' : 'local'
  });
});

/**
 * First-person, conversational response generator based on resume data
 * Sounds natural and human-like while remaining professional
 */
function smartResumeResponder(message) {
  const resume = require('./data.js').resumeData;
  const q = message.toLowerCase();

  if (/(birth|born|birthday|age|when were you born)/.test(q)) {
    return `I was born on ${resume.personal.birthDate} in ${resume.personal.birthplace}! 🎂`;
  }
  
  if (/(email|contact|reach|how can i contact|how to reach)/.test(q)) {
    return `Sure! You can reach me at ${resume.personal.email}. I'm based in ${resume.personal.address} 😊`;
  }

  if (/(gender)/.test(q)) {
    return `I'm ${resume.personal.gender}!`;
  }

  if (/(citizen|nationality)/.test(q)) {
    return `I'm ${resume.personal.citizenship}! 🇵🇭`;
  }

  if (/(religion|faith)/.test(q)) {
    return `I'm ${resume.personal.religion}. ✝️`;
  }

  if (/(address|live|location|where are you|based)/.test(q)) {
    return `I'm based in ${resume.personal.address}! It's home. 🏠`;
  }
  
  if (/(degree|education|school|studying|what are you studying|background|field)/.test(q)) {
    return `I'm currently pursuing a ${resume.education.degree} at ${resume.education.school} (${resume.education.years}). My capstone project is "${resume.education.capstone}" — it's been a really interesting experience! Before this, I did Senior High at ${resume.education.shs.school} (${resume.education.shs.years}) and Junior High at ${resume.education.jhs.school} (${resume.education.jhs.years}).`;
  }

  if (/(capstone|project|thesis)/.test(q)) {
    return `Oh, my capstone project is "${resume.education.capstone}"! It's a pretty cool project. 😄`;
  }
  
  if (/(list certif|all certif|certifications you have|how many cert)/.test(q)) {
    const certs = resume.certifications.map(c => c.title).join('\n- ');
    return `I've got ${resume.certifications.length} certifications so far! Here they are:\n- ${certs}`;
  }
  
  if (/(certif|training|credential|qualification|what certifications)/.test(q)) {
    const recentCerts = resume.certifications.slice(0, 3).map(c => `${c.title} from ${c.org} (${c.date})`).join('\n- ');
    return `I've earned ${resume.certifications.length} certifications! Here are some recent ones:\n- ${recentCerts}`;
  }
  
  if (/(event|conference|seminar|workshop|what events|attended)/.test(q)) {
    if (/list|all|show/.test(q)) {
      const events = resume.events.map(e => `${e.title} at ${e.venue} (${e.date})`).join('\n- ');
      return `I've been to ${resume.events.length} events! Here's the full list:\n- ${events}`;
    }
    const recentEvents = resume.events.slice(0, 3).map(e => `${e.title} at ${e.venue} (${e.date})`).join('\n- ');
    return `I've attended ${resume.events.length} events so far! Here are a few recent ones:\n- ${recentEvents}`;
  }
  
  if (/(skill|technical|programming|language|framework|technology|what can you code|what languages)/.test(q)) {
    const langs = (resume.skills['Programming Languages'] || []).map(s => typeof s === 'object' ? `${s.lang} (${s.proficiency})` : s).filter(Boolean).join(', ');
    const fws = (resume.skills['Frameworks & Libraries'] || []).map(s => typeof s === 'object' ? s.name : s).filter(Boolean).join(', ');
    const tech = (resume.skills['Technical IT Skills'] || []).map(s => typeof s === 'object' ? s.skill : s).filter(Boolean).join(', ');
    const dbs = (resume.skills['Databases'] || []).map(s => typeof s === 'object' ? s.system : s).filter(Boolean).join(', ');
    let response = 'Here\'s what I work with! 💻';
    if (langs) response += `\n\n🔤 Programming Languages: ${langs}`;
    if (fws) response += `\n\n🧩 Frameworks & Libraries: ${fws}`;
    if (dbs) response += `\n\n🗄️ Databases: ${dbs}`;
    if (tech) response += `\n\n🔧 Technical IT Skills: ${tech}`;
    return response;
  }
  
  if (/(affiliation|member|organization|group|role|team|community)/.test(q)) {
    if (resume.affiliations && resume.affiliations.length > 0) {
      const allAff = resume.affiliations.map(a => `${a.role} at ${a.organization} (${a.period})`).join('\n- ');
      return `I'm part of a few organizations! Here are my roles:\n- ${allAff}`;
    }
    return `Hmm, I don't have affiliation info to share on that one!`;
  }
  
  if (/(experience|tell me about yourself|who are you|introduce)/.test(q)) {
    const affCount = resume.affiliations?.length || 0;
    return `Hey! I'm ${resume.personal.name} 👋 I'm currently pursuing a ${resume.education.degree} at ${resume.education.school} (${resume.education.years}). My capstone project is "${resume.education.capstone}". So far I've earned ${resume.certifications.length} certifications, attended ${resume.events.length} events, and I hold ${affCount} organizational roles!`;
  }

  return null;
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'missing message' });

  let resumeContext = '';

  // Search Upstash database for relevant resume information (if available)
  if (upstashIndex) {
    try {
      const searchResults = await upstashIndex.query(
        {
          data: message,
          topK: 10,
          includeMetadata: true
        }
      );

      if (searchResults && searchResults.length > 0) {
        const contextItems = searchResults
          .map(r => getTextFromId(r.id))
          .filter(t => t)
          .slice(0, 8);
        
        if (contextItems.length > 0) {
          resumeContext = `\n\nRelevant context about me: ${contextItems.slice(0, 3).join('; ')}`;
        }
      }
    } catch (err) {
      console.warn('⚠️ Upstash search error:', err.message);
    }
  }

  // Build factual context from actual resume data
  const resume = require('./data.js').resumeData;
  const certList = resume.certifications.slice(0, 5).map(c => c.title).join('; ');
  const eventList = resume.events.slice(0, 5).map(e => `${e.title} (${e.date})`).join('; ');
  const affList = resume.affiliations.map(a => `${a.role} at ${a.organization} (${a.period})`).join('; ');
  const langs = (resume.skills['Programming Languages'] || []).map(s => typeof s === 'object' ? s.lang : s).filter(Boolean).join(', ');
  const fws = (resume.skills['Frameworks & Libraries'] || []).map(s => typeof s === 'object' ? s.name : s).filter(Boolean).join(', ');
  const techSkills = (resume.skills['Technical IT Skills'] || []).map(s => typeof s === 'object' ? s.skill : s).filter(Boolean).join(', ');

  const systemPrompt = `You are Tashanda Chealsy A. Antonio. You answer questions about yourself in first person using ONLY the facts below. NEVER invent, assume, or add information that is not listed here. If you don't have information about something, say "I don't have that information to share."

Personal:
- Name: ${resume.personal.name}
- Birth Date: ${resume.personal.birthDate}
- Birthplace: ${resume.personal.birthplace}
- Gender: ${resume.personal.gender}
- Citizenship: ${resume.personal.citizenship}
- Religion: ${resume.personal.religion}
- Address: ${resume.personal.address}
- Email: ${resume.personal.email}

Education:
- Degree: ${resume.education.degree} at ${resume.education.school} (${resume.education.years})
- Capstone: ${resume.education.capstone}
- Senior High: ${resume.education.shs.school} (${resume.education.shs.years})
- Junior High: ${resume.education.jhs.school} (${resume.education.jhs.years})

Skills:
- Programming Languages: ${langs}
- Frameworks & Libraries: ${fws}
- Technical IT Skills: ${techSkills}

Certifications (${resume.certifications.length} total): ${certList}

Events (${resume.events.length} total): ${eventList}

Affiliations: ${affList}

Rules:
- Always speak in first person
- Sound warm, friendly, and approachable — like chatting with a friend, not reading a resume
- Use casual language, contractions, and light expressions (e.g. "Oh!", "honestly", "haha", "pretty cool")
- ONLY state facts from the data above — you can phrase them casually but NEVER invent new information
- Do NOT make up hobbies, interests, motivations, personality traits, or experiences not listed
- If asked about something not in the data, just say something like "Hmm, I don't really have info on that one!"
- Keep responses concise but personable${resumeContext}`;

  const apiTimeout = 5000; // 5 seconds max per API

  // Try GROQ API if available
  if (process.env.GROQ_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), apiTimeout);

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.5
        })
      });

      clearTimeout(timeoutId);

      const j = await resp.json();
      if (j?.choices?.[0]?.message?.content) {
        const reply = j.choices[0].message.content;
        return res.json({ reply });
      }
    } catch (err) {
      console.warn('⚠️ GROQ timeout or error:', err.message);
    }
  }

  // Try OpenAI if GROQ isn't available or failed
  if (process.env.OPENAI_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), apiTimeout);

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      clearTimeout(timeoutId);

      const j = await resp.json();
      if (j?.choices?.[0]?.message?.content) {
        const reply = j.choices[0].message.content;
        return res.json({ reply });
      }
    } catch (err) {
      console.warn('⚠️ OpenAI timeout or error:', err.message);
    }
  }

  // Fallback 1: Use smart resume responder if all APIs failed
  const smartResponse = smartResumeResponder(message);
  if (smartResponse) {
    return res.json({ reply: smartResponse });
  }

  // Fallback 2: local keyword-based answer
  const local = localAnswer(message);
  if (local) return res.json({ reply: local });

  return res.json({ reply: "Hey! Feel free to ask me about my background, education, skills, certifications, events, or affiliations — I'd love to chat! 😊" });
});

// Serve stats page
app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, 'stats.html'));
});

// API endpoint to get interview statistics
app.get('/api/stats', (req, res) => {
  const interviews = loadInterviewHistory();

  if (interviews.length === 0) {
    return res.json({
      interviews: [],
      stats: {
        totalInterviews: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      },
      scoreDistribution: {}
    });
  }

  // Calculate statistics
  const scores = interviews.map(i => i.averageScore);
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const avgScore = Math.round((totalScore / scores.length) * 10) / 10;
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  // Calculate score distribution (5 ranges: 0-20, 21-40, 41-60, 61-80, 81-100)
  const distribution = {
    '0-20%': 0,
    '21-40%': 0,
    '41-60%': 0,
    '61-80%': 0,
    '81-100%': 0
  };

  scores.forEach(score => {
    if (score <= 20) distribution['0-20%']++;
    else if (score <= 40) distribution['21-40%']++;
    else if (score <= 60) distribution['41-60%']++;
    else if (score <= 80) distribution['61-80%']++;
    else distribution['81-100%']++;
  });

  // Sort interviews by score (highest to lowest) for rankings
  const sortedInterviews = [...interviews].sort((a, b) => b.averageScore - a.averageScore);

  res.json({
    interviews: sortedInterviews,
    stats: {
      totalInterviews: interviews.length,
      averageScore: avgScore,
      highestScore,
      lowestScore
    },
    scoreDistribution: distribution
  });
});

// API endpoint to save interview result
app.post('/api/interview-result', (req, res) => {
  const { jobTitle, company, scores, averageScore, date } = req.body;
  
  if (!jobTitle || !scores || averageScore === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const interviews = loadInterviewHistory();
    
    const newRecord = {
      id: Date.now(),
      jobTitle,
      company: company || 'Unknown Company',
      date: date || new Date().toISOString(),
      scores,
      averageScore
    };
    
    interviews.push(newRecord);
    saveInterviewHistory(interviews);

    res.json({ 
      success: true,
      message: 'Interview result recorded',
      record: newRecord
    });
  } catch (error) {
    console.error('Error saving interview result:', error);
    res.status(500).json({ error: 'Failed to save interview result' });
  }
});

// API endpoint to sync interview history from browser localStorage to server file
app.post('/api/sync-interviews', (req, res) => {
  const { interviews } = req.body;
  
  if (!Array.isArray(interviews)) {
    return res.status(400).json({ error: 'interviews must be an array' });
  }

  try {
    // Merge with existing file data to avoid losing anything
    const fileData = loadInterviewHistory();
    const fileIds = new Set(fileData.map(i => i.id));
    
    // Add any interviews from the request that aren't already in the file
    let addedCount = 0;
    interviews.forEach(interview => {
      if (!fileIds.has(interview.id)) {
        fileData.push(interview);
        addedCount++;
      }
    });

    // Save merged data back to file
    saveInterviewHistory(fileData);

    res.json({
      success: true,
      message: `Synced ${addedCount} new interview records`,
      totalRecords: fileData.length,
      addedCount,
      interviews: fileData
    });
  } catch (error) {
    console.error('Error syncing interviews:', error);
    res.status(500).json({ error: 'Failed to sync interviews' });
  }
});

// API endpoint to generate custom job interview questions
app.post('/api/generate-custom-questions', async (req, res) => {
  const { jobTitle, skills, responsibilities } = req.body;
  
  if (!jobTitle) {
    return res.status(400).json({ error: 'Missing job title' });
  }

  const systemPrompt = `You are an expert technical interviewer. Generate 5 specific, challenging interview questions for a ${jobTitle} position.
  
Job Requirements:
- Title: ${jobTitle}
- Key Skills: ${skills && skills.length > 0 ? skills.join(', ') : 'not specified'}
- Responsibilities: ${responsibilities && responsibilities.length > 0 ? responsibilities.join(', ') : 'not specified'}

Generate exactly 5 interview questions that:
1. Are specific to this job title and requirements
2. Test relevant technical knowledge
3. Vary in difficulty and topic
4. Are open-ended to reveal depth of knowledge

Return as a JSON array of strings, nothing else.`;

  if (process.env.GROQ_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate interview questions for: ${jobTitle}` }
          ],
          max_tokens: 800,
          temperature: 0.8
        })
      });

      clearTimeout(timeoutId);

      const j = await resp.json();
      if (j?.choices?.[0]?.message?.content) {
        try {
          const content = j.choices[0].message.content;
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            return res.json({ questions });
          }
        } catch (parseErr) {
          console.warn('Error parsing questions:', parseErr);
        }
      }
    } catch (err) {
      console.warn('Error generating questions:', err.message);
    }
  }

  // Fallback: Generic questions if GROQ fails
  const fallbackQuestions = [
    `What experience do you have with the key technologies required for this ${jobTitle} position?`,
    `Describe a project where you successfully handled ${responsibilities && responsibilities.length > 0 ? responsibilities[0] : 'a complex technical challenge'}.`,
    `How do you approach learning new tools and frameworks required for ${jobTitle} roles?`,
    `Tell us about your most significant technical achievement and why it matters for this position.`,
    `How would you handle the most challenging aspect of the ${jobTitle} role?`
  ];

  res.json({ questions: fallbackQuestions });
});

// API endpoint to score custom interview answers
app.post('/api/score-interview-answer', async (req, res) => {
  const { question, answer, jobTitle, skills } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ error: 'Missing question or answer' });
  }

  let resumeContext = '';
  
  // Search Upstash for resume context
  if (upstashIndex) {
    try {
      const searchResults = await upstashIndex.query({
        data: `${question} ${answer}`,
        topK: 5,
        includeMetadata: true
      });

      if (searchResults && searchResults.length > 0) {
        const contextItems = searchResults
          .map(r => getTextFromId(r.id))
          .filter(t => t);
        
        if (contextItems.length > 0) {
          resumeContext = `Resume Context: ${contextItems.slice(0, 2).join('; ')}`;
        }
      }
    } catch (err) {
      console.warn('Upstash search error:', err.message);
    }
  }

  const scoringPrompt = `You are an expert technical interviewer scoring interview responses. Score this response on scale 0-100 based on:
- Relevance to the job (${jobTitle})
- Technical depth and accuracy
- Evidence of real experience
- Communication clarity
- Problem-solving approach

Job Skills: ${skills && skills.length > 0 ? skills.join(', ') : 'General'}
${resumeContext}

Question: ${question}
Answer: ${answer}

Respond with ONLY a JSON object: {"score": <0-100>, "reasoning": "<brief reason>"}`;

  if (process.env.GROQ_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: scoringPrompt },
            { role: 'user', content: 'Score this interview response' }
          ],
          max_tokens: 200,
          temperature: 0.5
        })
      });

      clearTimeout(timeoutId);

      const j = await resp.json();
      if (j?.choices?.[0]?.message?.content) {
        try {
          const content = j.choices[0].message.content;
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return res.json({ 
              score: Math.min(Math.max(result.score, 20), 95),
              reasoning: result.reasoning 
            });
          }
        } catch (parseErr) {
          console.warn('Error parsing score:', parseErr);
        }
      }
    } catch (err) {
      console.warn('Error scoring answer:', err.message);
    }
  }

  // Fallback scoring based on answer length and keyword matching
  const keywordScore = (skills && skills.length > 0) 
    ? Math.min(skills.filter(s => answer.toLowerCase().includes(s.toLowerCase())).length * 10, 40)
    : 20;
  
  const lengthBonus = answer.length > 150 ? 15 : answer.length > 80 ? 8 : 0;
  const detailBonus = (answer.match(/\b(implemented|created|developed|designed|solved|managed)\b/gi) || []).length * 5;
  
  const fallbackScore = Math.min(keywordScore + lengthBonus + detailBonus + Math.random() * 20, 95);

  res.json({ 
    score: Math.max(Math.round(fallbackScore), 20),
    reasoning: 'Scored based on answer quality, keyword matching, and detail level'
  });
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
