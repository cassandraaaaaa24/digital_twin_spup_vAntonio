(() => {
  // ── Dark Mode Toggle ──
  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeUI();
  }

  function updateThemeUI() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', newTheme === 'light' ? '' : 'dark');
    if (newTheme === 'light') document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', newTheme === 'light' ? '' : 'dark');
    updateThemeUI();
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 350);
  }

  initTheme();
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

  // Initialize splash screen
  function initSplashScreen() {
    const splash = document.createElement('div');
    splash.className = 'splash-screen';
    splash.innerHTML = `
      <div class="splash-content">
        <div class="splash-logo">✨</div>
        <div class="splash-text">Welcome to My Digital Twin</div>
        <div class="splash-dots">
          <span class="splash-dot">.</span>
          <span class="splash-dot">.</span>
          <span class="splash-dot">.</span>
        </div>
      </div>
    `;
    document.body.insertBefore(splash, document.body.firstChild);
  }
  
  // Show splash screen on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplashScreen);
  } else {
    initSplashScreen();
  }

  const tabsEl = document.getElementById('tabs');
  const contentEl = document.getElementById('content');

  const resume = window.resumeData;

  // Hidden text measurer used to compute word widths for dynamic bubble sizing
  const _textMeasurer = document.createElement('span');
  _textMeasurer.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre;padding:0;margin:0;';
  document.body.appendChild(_textMeasurer);

  const sections = [
    { id: 'personal', title: 'Personal Data' },
    { id: 'education', title: 'Educational Background' },
    { id: 'certs', title: 'Certifications' },
    { id: 'events', title: 'Seminars / Workshops / Conferences' },
    { id: 'timeline', title: 'Timeline' },
    { id: 'skills', title: 'Skills' },
    { id: 'affiliations', title: 'Affiliations' }
  ];

  function createTabs() {
    sections.forEach((s, i) => {
      const btn = document.createElement('button');
      const icon = svgIcon(s.id);
      btn.innerHTML = `<span class="icon">${icon}</span><span class="label">${s.title}</span>`;
      btn.dataset.section = s.id;
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('#tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSection(s.id);
      });
      tabsEl.appendChild(btn);
    });
  }

  function svgIcon(id){
    // simple single-color SVGs (use currentColor)
    switch(id){
      case 'personal': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>`;
      case 'education': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2 1 7l11 5 9-4.09V17h2V7L12 2z"/></svg>`;
      case 'certs': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9 8 12 2z"/></svg>`;
      case 'events': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM5 9h14v10H5V9z"/></svg>`;
      case 'skills': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
      case 'timeline': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zM12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`;
      case 'affiliations': return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 2h-2.47c-.45.34-.98.62-1.58.8L12 22l-2.95-5.18c-.6-.18-1.13-.46-1.58-.8H5c0 2.21 3.58 4 7 4s7-1.79 7-4z"/></svg>`;
      default: return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/></svg>`;
    }
  }

  function renderSection(id) {
    contentEl.innerHTML = '';
    contentEl.classList.remove('fade-in');
    if (id === 'personal') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Personal Data';
      contentEl.appendChild(h);

      const card = document.createElement('div'); card.className = 'personal-card';
      const avatar = document.createElement('div'); avatar.className = 'avatar-lg';
      const img = document.createElement('img'); img.src = 'public/assets/images/Antonio_Pic.png'; img.alt = 'avatar';
      avatar.appendChild(img);

      const main = document.createElement('div'); main.className = 'personal-main';
      const name = document.createElement('h2'); name.textContent = resume.personal.name || 'Name';
      const role = document.createElement('div'); role.className = 'role'; role.textContent = resume.education.degree + ' — ' + resume.education.school;

      const contactsWrap = document.createElement('div'); contactsWrap.className = 'personal-grid';
      const fields = [
        ['Birth Date', resume.personal.birthDate],
        ['Birthplace', resume.personal.birthplace],
        ['Gender', resume.personal.gender],
        ['Citizenship', resume.personal.citizenship],
        ['Religion', resume.personal.religion],
        ['Address', resume.personal.address],
        ['Email', resume.personal.email]
      ];
      fields.forEach(([label, val]) => {
        const f = document.createElement('div'); f.className = 'p-field';
        f.innerHTML = `<div class="p-label">${label}</div><div class="p-value">${val}</div>`;
        contactsWrap.appendChild(f);
      });

      main.appendChild(name); main.appendChild(role); main.appendChild(contactsWrap);
      card.appendChild(avatar); card.appendChild(main);
      contentEl.appendChild(card);
    }
    if (id === 'education') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Educational Background';
      contentEl.appendChild(h);
      const e = resume.education;
      const container = document.createElement('div'); container.className = 'education-container';

      // Degree Card
      const degreeCard = document.createElement('div'); degreeCard.className = 'education-card';
      const degreeHeader = document.createElement('div'); degreeHeader.className = 'education-header';
      const degreeLevel = document.createElement('span'); degreeLevel.className = 'education-level'; degreeLevel.textContent = 'Degree';
      const degreeYears = document.createElement('span'); degreeYears.className = 'education-period'; degreeYears.textContent = e.years;
      degreeHeader.appendChild(degreeLevel); degreeHeader.appendChild(degreeYears);

      const degreeField1 = document.createElement('div'); degreeField1.className = 'education-field';
      degreeField1.innerHTML = `<span class="education-label">Program</span><div class="education-value">${e.degree}</div>`;
      const degreeField2 = document.createElement('div'); degreeField2.className = 'education-field';
      degreeField2.innerHTML = `<span class="education-label">School</span><div class="education-value">${e.school}</div>`;
      const degreeField3 = document.createElement('div'); degreeField3.className = 'education-field';
      degreeField3.innerHTML = `<span class="education-label">Capstone Project</span><div class="education-value">${e.capstone}</div><div class="education-description">(Uses IoT and RFID technology for smart door security systems)</div>`;

      degreeCard.appendChild(degreeHeader); degreeCard.appendChild(degreeField1); degreeCard.appendChild(degreeField2); degreeCard.appendChild(degreeField3);
      container.appendChild(degreeCard);

      // Senior HS Card
      const shsCard = document.createElement('div'); shsCard.className = 'education-card';
      const shsHeader = document.createElement('div'); shsHeader.className = 'education-header';
      const shsLevel = document.createElement('span'); shsLevel.className = 'education-level'; shsLevel.textContent = 'Senior High';
      const shsYears = document.createElement('span'); shsYears.className = 'education-period'; shsYears.textContent = e.shs.years;
      shsHeader.appendChild(shsLevel); shsHeader.appendChild(shsYears);

      const shsField = document.createElement('div'); shsField.className = 'education-field';
      shsField.innerHTML = `<span class="education-label">School</span><div class="education-value">${e.shs.school}</div>`;

      shsCard.appendChild(shsHeader); shsCard.appendChild(shsField);
      container.appendChild(shsCard);

      // Junior HS Card
      const jhsCard = document.createElement('div'); jhsCard.className = 'education-card';
      const jhsHeader = document.createElement('div'); jhsHeader.className = 'education-header';
      const jhsLevel = document.createElement('span'); jhsLevel.className = 'education-level'; jhsLevel.textContent = 'Junior High';
      const jhsYears = document.createElement('span'); jhsYears.className = 'education-period'; jhsYears.textContent = e.jhs.years;
      jhsHeader.appendChild(jhsLevel); jhsHeader.appendChild(jhsYears);

      const jhsField = document.createElement('div'); jhsField.className = 'education-field';
      jhsField.innerHTML = `<span class="education-label">School</span><div class="education-value">${e.jhs.school}</div>`;

      jhsCard.appendChild(jhsHeader); jhsCard.appendChild(jhsField);
      container.appendChild(jhsCard);

      contentEl.appendChild(container);
    }
    if (id === 'certs') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Certifications';
      contentEl.appendChild(h);
      resume.certifications.forEach(c => {
        const card = document.createElement('div'); card.className = 'education-card';
        
        const header = document.createElement('div'); header.className = 'education-header';
        const title = document.createElement('span'); title.className = 'education-level'; title.textContent = c.title;
        header.appendChild(title);
        
        const field1 = document.createElement('div'); field1.className = 'education-field';
        field1.innerHTML = `<span class="education-label">Organization</span><div class="education-value">${c.org}</div>`;
        
        const field2 = document.createElement('div'); field2.className = 'education-field';
        field2.innerHTML = `<span class="education-label">Date</span><div class="education-value">${c.date}</div>`;
        
        const field3 = document.createElement('div'); field3.className = 'education-field';
        const descDiv = document.createElement('div');
        descDiv.className = 'education-description';
        descDiv.textContent = c.desc || '';
        field3.appendChild(descDiv);
        
        card.appendChild(header);
        card.appendChild(field1);
        card.appendChild(field2);
        card.appendChild(field3);
        contentEl.appendChild(card);
      });
    }
    if (id === 'events') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Seminars / Workshops / Conferences';
      contentEl.appendChild(h);
      resume.events.forEach(ev => {
        const card = document.createElement('div'); card.className = 'education-card';
        
        const header = document.createElement('div'); header.className = 'education-header';
        const title = document.createElement('span'); title.className = 'event-title'; title.textContent = ev.title;
        header.appendChild(title);
        
        const field1 = document.createElement('div'); field1.className = 'education-field';
        field1.innerHTML = `<span class="education-label">Venue</span><div class="education-value">${ev.venue}</div>`;
        
        const field2 = document.createElement('div'); field2.className = 'education-field';
        field2.innerHTML = `<span class="education-label">Date</span><div class="education-value">${ev.date}</div>`;
        
        const field3 = document.createElement('div'); field3.className = 'education-field';
        // Show the event description here instead of images for seminars/workshops
        const descDiv = document.createElement('div');
        descDiv.className = 'education-description';
        descDiv.textContent = ev.desc || '';
        field3.appendChild(descDiv);
        
        card.appendChild(header);
        card.appendChild(field1);
        card.appendChild(field2);
        card.appendChild(field3);
        contentEl.appendChild(card);
      });
    }
    if (id === 'timeline') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Timeline';
      contentEl.appendChild(h);

      // Combine certifications and events into one sorted timeline
      const items = [];
      (resume.certifications || []).forEach(c => {
        items.push({ type: 'cert', title: c.title, subtitle: c.org, date: c.date, desc: c.desc || '' });
      });
      (resume.events || []).forEach(ev => {
        items.push({ type: 'event', title: ev.title, subtitle: ev.venue, date: ev.date, desc: ev.desc || '' });
      });

      // Parse date for sorting (handle ranges like "March 26-28, 2025")
      function parseTimelineDate(str) {
        if (!str) return new Date(0);
        const cleaned = str.replace(/(\w+)\s+\d+-\d+,/, '$1 1,'); // collapse ranges
        const d = new Date(cleaned);
        return isNaN(d.getTime()) ? new Date(0) : d;
      }

      items.sort((a, b) => parseTimelineDate(b.date) - parseTimelineDate(a.date));

      const timeline = document.createElement('div'); timeline.className = 'timeline-container';
      items.forEach((item, idx) => {
        const row = document.createElement('div'); row.className = 'timeline-item';
        row.style.animationDelay = (idx * 0.07) + 's';

        const dot = document.createElement('div'); dot.className = 'timeline-dot ' + (item.type === 'cert' ? 'dot-cert' : 'dot-event');

        const content = document.createElement('div'); content.className = 'timeline-content';

        const badge = document.createElement('span');
        badge.className = 'timeline-badge ' + (item.type === 'cert' ? 'badge-cert' : 'badge-event');
        badge.textContent = item.type === 'cert' ? 'Certification' : 'Event';

        const dateEl = document.createElement('span'); dateEl.className = 'timeline-date'; dateEl.textContent = item.date;

        const titleEl = document.createElement('h3'); titleEl.className = 'timeline-title'; titleEl.textContent = item.title;

        const subtitleEl = document.createElement('p'); subtitleEl.className = 'timeline-subtitle'; subtitleEl.textContent = item.subtitle;

        const descEl = document.createElement('p'); descEl.className = 'timeline-desc'; descEl.textContent = item.desc;

        content.appendChild(badge);
        content.appendChild(dateEl);
        content.appendChild(titleEl);
        content.appendChild(subtitleEl);
        if (item.desc) content.appendChild(descEl);

        row.appendChild(dot);
        row.appendChild(content);
        timeline.appendChild(row);
      });
      contentEl.appendChild(timeline);
    }
    if (id === 'skills') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Skills';
      contentEl.appendChild(h);
      
      if (resume.skills) {
        Object.entries(resume.skills).forEach(([category, skillList]) => {
          if (Array.isArray(skillList) && skillList.length > 0) {
            const catDiv = document.createElement('div'); catDiv.className = 'skill-category';
            const catTitle = document.createElement('h3'); 
            catTitle.textContent = category;
            catTitle.className = 'skill-category-title';
            catDiv.appendChild(catTitle);
            
            const skillList_el = document.createElement('ul'); skillList_el.className = 'skill-list';
            skillList.forEach(skill => {
              const li = document.createElement('li'); 
              if (typeof skill === 'object') {
                const skillName = skill.skill || skill.lang || skill.name || skill.system || skill.area || '';
                const skillLevel = skill.proficiency || skill.level || skill.useCases || skill.features || skill.details || '';
                li.innerHTML = `<strong>${skillName}</strong><span class="skill-level">${skillLevel}</span>`;
              } else {
                li.textContent = skill;
              }
              li.addEventListener('click', function(e) {
                document.querySelectorAll('.skill-list li').forEach(item => {
                  item.classList.remove('active');
                });
                this.classList.add('active');
              });
              skillList_el.appendChild(li);
            });
            catDiv.appendChild(skillList_el);
            contentEl.appendChild(catDiv);
          }
        });
      }
    }
    if (id === 'affiliations') {
      const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = 'Affiliations';
      contentEl.appendChild(h);
      resume.affiliations.forEach(a => {
        const card = document.createElement('div'); card.className = 'education-card';
        
        const header = document.createElement('div'); header.className = 'education-header';
        const title = document.createElement('span'); title.className = 'education-level'; title.textContent = a.role;
        const period = document.createElement('span'); period.className = 'education-period'; period.textContent = a.period;
        header.appendChild(title);
        header.appendChild(period);
        
        const field1 = document.createElement('div'); field1.className = 'education-field';
        field1.innerHTML = `<span class="education-label">Organization</span><div class="education-value">${a.organization}</div>`;
        
        const field2 = document.createElement('div'); field2.className = 'education-field';
        const descDiv = document.createElement('div');
        descDiv.className = 'education-description';
        descDiv.textContent = a.desc || '';
        field2.appendChild(descDiv);
        
        card.appendChild(header);
        card.appendChild(field1);
        card.appendChild(field2);
        contentEl.appendChild(card);
      });
    }
    
    // Trigger entrance animations
    setTimeout(() => {
      contentEl.classList.add('fade-in');
    }, 50);
  }

  function toLabel(key){
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s=>s.toUpperCase());
  }

  createTabs();
  renderSection('personal');

  // Search functionality
  const navSearch = document.getElementById('navSearch');
  navSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderSection('personal');
      return;
    }
    
    // Search through all resume data
    let results = [];
    const seen = new Set();
    
    function addResult(result, key) {
      if (seen.has(key)) return;
      seen.add(key);
      results.push(result);
    }
    
    // Search in personal data
    for (let key in resume.personal) {
      if (String(resume.personal[key]).toLowerCase().includes(query)) {
        addResult({ section: 'Personal Data', type: key, value: resume.personal[key] }, `personal_${key}`);
      }
    }
    
    // Search in education
    for (let key in resume.education) {
      if (typeof resume.education[key] === 'object') {
        for (let subkey in resume.education[key]) {
          if (String(resume.education[key][subkey]).toLowerCase().includes(query)) {
            addResult({ section: 'Education', type: key, value: resume.education[key][subkey] }, `education_${key}`);
          }
        }
      } else {
        if (String(resume.education[key]).toLowerCase().includes(query)) {
          addResult({ section: 'Education', type: key, value: resume.education[key] }, `education_${key}`);
        }
      }
    }
    
    // Search in certifications
    resume.certifications.forEach((c, i) => {
      if (typeof c === 'object') {
        const matched = Object.values(c).some(v => String(v).toLowerCase().includes(query));
        if (matched) {
          addResult({ section: 'Certifications', item: c.title, value: c.org || '' }, `cert_${i}`);
        }
      }
    });
    
    // Search in events
    resume.events.forEach((ev, i) => {
      const matched = Object.values(ev).some(v => String(v).toLowerCase().includes(query));
      if (matched) {
        addResult({ section: 'Events', item: ev.title, value: ev.venue || '' }, `event_${i}`);
      }
    });
    
    // Search in skills
    if (resume.skills) {
      Object.entries(resume.skills).forEach(([category, skillList]) => {
        if (Array.isArray(skillList)) {
          skillList.forEach((skill, i) => {
            if (typeof skill === 'object') {
              const matched = Object.values(skill).some(v => String(v).toLowerCase().includes(query));
              if (matched) {
                addResult({ section: 'Skills', category: category, item: skill.skill || skill.name || skill.lang || skill.area || skill.system, value: '' }, `skill_${category}_${i}`);
              }
            }
          });
        }
      });
    }
    
    // Search in affiliations
    resume.affiliations.forEach((a, i) => {
      if (typeof a === 'object') {
        const matched = Object.values(a).some(v => String(v).toLowerCase().includes(query));
        if (matched) {
          addResult({ section: 'Affiliations', item: a.role, value: a.organization || '' }, `affil_${i}`);
        }
      }
    });
    
    // Display search results
    contentEl.innerHTML = '';
    const h = document.createElement('h2'); h.className = 'section-title'; h.textContent = `Search Results (${results.length})`;
    contentEl.appendChild(h);
    
    if (results.length === 0) {
      const noResults = document.createElement('p');
      noResults.style.color = 'var(--text-secondary)';
      noResults.style.padding = '20px';
      noResults.textContent = `No results found for "${query}"`;
      contentEl.appendChild(noResults);
    } else {
      results.forEach((result, i) => {
        const card = document.createElement('div'); card.className = 'education-card';
        const header = document.createElement('div'); header.className = 'education-header';
        const title = document.createElement('span'); title.className = 'education-level'; title.textContent = result.section;
        header.appendChild(title);
        
        const field = document.createElement('div'); field.className = 'education-field';
        if (result.item) {
          field.innerHTML = `<span class="education-label">${result.type || result.category || 'Item'}</span><div class="education-value">${result.item}</div>`;
        } else if (result.type) {
          field.innerHTML = `<span class="education-label">${result.type}</span><div class="education-value">${result.value}</div>`;
        }
        
        card.appendChild(header);
        card.appendChild(field);
        contentEl.appendChild(card);
      });
    }
    
    setTimeout(() => {
      contentEl.classList.add('fade-in');
    }, 50);
  });

  // Chat functionality (simple keyword-based responder over resume data)
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const closeChat = document.getElementById('closeChat');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatLog = document.getElementById('chatLog');
  const modeQABtn = document.getElementById('modeQA');
  const modeInterviewBtn = document.getElementById('modeInterview');
  const interviewModePanel = document.getElementById('interviewModePanel');
  const jobSelect = document.getElementById('jobSelect');
  const startInterviewBtn = document.getElementById('startInterviewBtn');

  let currentMode = 'qa'; // 'qa' or 'interview'
  let currentInterviewJob = null;
  let currentMatchScore = null;
  let interviewQuestionCount = 0;
  let questionScores = [];
  let currentJobDetails = null;

  // Match calculation functions (from interview_simulator.html)
  function calculateMatchScore(jobDetails) {
    try {
      const resumeSkills = extractResumeSkills();
      const jobSkillsList = parseJobSkills(jobDetails);
      let skillMatches = 0;
      
      for (let jobSkill of jobSkillsList) {
        const jobSkillLower = jobSkill.toLowerCase();
        for (let resumeSkill of resumeSkills) {
          const resumeSkillLower = resumeSkill.toLowerCase();
          if (jobSkillLower === resumeSkillLower || 
              jobSkillLower.includes(resumeSkillLower) || 
              resumeSkillLower.includes(jobSkillLower)) {
            skillMatches++;
            break;
          }
        }
      }

      let score = 0;
      const skillScore = jobSkillsList.length > 0 ? (skillMatches / jobSkillsList.length) * 100 : 50;
      score += skillScore * 0.5;

      const resumeLevel = getResumeExperienceLevel();
      const jobLevel = getJobExperienceLevel(jobDetails);
      const levelAlignment = calculateLevelAlignment(resumeLevel, jobLevel);
      score += levelAlignment * 0.25;

      const certRelevance = evaluateCertificateRelevance(jobDetails);
      score += certRelevance * 0.15;

      const projectRelevance = evaluateProjectExperience(jobDetails);
      score += projectRelevance * 0.1;

      return Math.min(Math.max(Math.round(score), 15), 92);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 65; // Fallback score
    }
  }

  function parseJobSkills(jobDetails) {
    const skillsSet = new Set();
    if (jobDetails.skills && Array.isArray(jobDetails.skills)) {
      jobDetails.skills.forEach(skill => skillsSet.add(skill.trim()));
    }
    if (jobDetails.responsibilities && Array.isArray(jobDetails.responsibilities)) {
      jobDetails.responsibilities.forEach(resp => {
        const keywords = extractTechKeywords(resp);
        keywords.forEach(kw => skillsSet.add(kw));
      });
    }
    return Array.from(skillsSet);
  }

  function extractTechKeywords(text) {
    const keywords = [];
    const techTerms = ['python', 'javascript', 'java', 'c#', 'html', 'css', 'react', 'node.js', 'express', 'django', 'flask', 'rest api', 'sql', 'mongodb', 'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'testing', 'agile', 'scrum', 'typescript', 'angular', 'vue', 'bootstrap', 'tailwind', 'php', 'kotlin', 'ai', 'machine learning', 'automation', 'devops', 'linux', 'windows'];
    const textLower = text.toLowerCase();
    techTerms.forEach(term => { if (textLower.includes(term)) keywords.push(term); });
    return keywords;
  }

  function extractResumeSkills() {
    const skills = [];
    if (window.resumeData && window.resumeData.skills) {
      // Extract from new detailed structure
      const progLangs = window.resumeData.skills['Programming Languages'];
      if (progLangs && Array.isArray(progLangs)) {
        progLangs.forEach(skill => {
          if (typeof skill === 'object' && skill.lang) {
            skills.push(skill.lang);
          } else if (typeof skill === 'string') {
            skills.push(skill);
          }
        });
      }
      const fwLibs = window.resumeData.skills['Frameworks & Libraries'];
      if (fwLibs && Array.isArray(fwLibs)) {
        fwLibs.forEach(skill => {
          if (typeof skill === 'object' && skill.name) {
            skills.push(skill.name);
          } else if (typeof skill === 'string') {
            skills.push(skill);
          }
        });
      }
      const techSkills = window.resumeData.skills['Technical IT Skills'];
      if (techSkills && Array.isArray(techSkills)) {
        techSkills.forEach(skill => {
          if (typeof skill === 'object' && skill.skill) {
            skills.push(skill.skill);
          } else if (typeof skill === 'string') {
            skills.push(skill);
          }
        });
      }
    }
    return skills;
  }

  function getResumeExperienceLevel() { return 1; }

  function getJobExperienceLevel(jobDetails) {
    const experienceText = (jobDetails.experience || []).join(' ').toLowerCase();
    const titleLower = (jobDetails.title || '').toLowerCase();
    if (titleLower.includes('junior') || titleLower.includes('entry')) return 1;
    else if (titleLower.includes('mid') || titleLower.includes('senior')) return 5;
    else if (titleLower.includes('lead') || titleLower.includes('principal')) return 7;
    if (experienceText.includes('0-1') || experienceText.includes('entry')) return 1;
    else if (experienceText.includes('1-2') || experienceText.includes('2-3')) return 2;
    else if (experienceText.includes('3-5') || experienceText.includes('3+') || experienceText.includes('4+')) return 4;
    else if (experienceText.includes('5+') || experienceText.includes('5-7')) return 5;
    else if (experienceText.includes('7+') || experienceText.includes('10+')) return 7;
    return 3;
  }

  function calculateLevelAlignment(resumeLevel, jobLevel) {
    const difference = Math.abs(resumeLevel - jobLevel);
    if (difference === 0) return 100;
    else if (difference === 1) return 80;
    else if (difference === 2) return 60;
    else if (difference >= 3 && resumeLevel < jobLevel) return 40;
    else if (difference >= 3 && resumeLevel > jobLevel) return 70;
    return 50;
  }

  function evaluateCertificateRelevance(jobDetails) {
    if (!window.resumeData || !window.resumeData.certifications) return 0.5;
    const jobTitle = (jobDetails.title || '').toLowerCase();
    const jobSkills = (jobDetails.skills || []).map(s => s.toLowerCase()).join(' ');
    let relevantCerts = 0;
    window.resumeData.certifications.forEach(cert => {
      // Handle both object format (new) and string format (legacy)
      const certName = typeof cert === 'object' ? (cert.title || cert.desc || '').toLowerCase() : cert.toLowerCase();
      const certDescription = typeof cert === 'object' ? (cert.desc || '').toLowerCase() : cert.toLowerCase();
      const certCombined = (certName + ' ' + certDescription).toLowerCase();
      
      if ((jobTitle.includes('ai') || jobSkills.includes('ai')) && certCombined.includes('ai')) relevantCerts++;
      else if ((jobTitle.includes('frontend') || jobSkills.includes('react')) && (certCombined.includes('sveltekit') || certCombined.includes('framework'))) relevantCerts++;
      else if ((jobTitle.includes('fintech') || jobSkills.includes('fintech')) && certCombined.includes('fintech')) relevantCerts++;
      else if ((jobTitle.includes('automation') || jobSkills.includes('automation')) && certCombined.includes('automation')) relevantCerts++;
      else if ((jobTitle.includes('cybersecurity') || jobSkills.includes('security')) && certCombined.includes('cyber')) relevantCerts++;
    });
    const totalCerts = window.resumeData.certifications.length || 32;
    return Math.min(0.5 + (relevantCerts / totalCerts) * 0.5, 1);
  }

  function evaluateProjectExperience(jobDetails) {
    if (!window.resumeData || !window.resumeData.events) return 0.5;
    const jobTitle = (jobDetails.title || '').toLowerCase();
    const jobSkills = (jobDetails.skills || []).map(s => s.toLowerCase()).join(' ');
    let relevantEvents = 0;
    window.resumeData.events.forEach(event => {
      const eventLower = event.title.toLowerCase();
      if (eventLower.includes('hackathon')) relevantEvents++;
      else if ((jobTitle.includes('ai') || jobSkills.includes('ai')) && eventLower.includes('ai')) relevantEvents++;
      else if ((jobTitle.includes('automation') || jobSkills.includes('automation')) && eventLower.includes('automation')) relevantEvents++;
      else if ((jobTitle.includes('frontend') || jobSkills.includes('react')) && eventLower.includes('framework')) relevantEvents++;
      else if ((jobTitle.includes('fintech') || jobSkills.includes('fintech')) && eventLower.includes('fintech')) relevantEvents++;
    });
    const totalEvents = window.resumeData.events.length || 21;
    return Math.min(0.5 + (relevantEvents / totalEvents) * 0.5, 1);
  }

  chatToggle.addEventListener('click', () => { chatPanel.classList.toggle('hidden'); });
  closeChat.addEventListener('click', () => { chatPanel.classList.add('hidden'); });

  // Mode switching
  function switchMode(mode) {
    currentMode = mode;
    // Update button states
    if (mode === 'qa') {
      modeQABtn.classList.add('active');
      modeInterviewBtn.classList.remove('active');
      chatForm.style.display = 'flex';
      interviewModePanel.style.display = 'none';
      chatLog.innerHTML = ''; // Clear chat log
      appendMsg("Hello! I'm your resume AI assistant. Ask me anything about your background.", 'bot');
    } else if (mode === 'interview') {
      modeQABtn.classList.remove('active');
      modeInterviewBtn.classList.add('active');
      chatForm.style.display = 'none';
      interviewModePanel.style.display = 'block';
      chatLog.innerHTML = ''; // Clear chat log
      appendMsg("Welcome to Interview Practice Mode! Select a job position and I'll conduct a mock interview.", 'bot');
    }
  }

  modeQABtn.addEventListener('click', () => switchMode('qa'));
  modeInterviewBtn.addEventListener('click', () => switchMode('interview'));

  // Switch between automatic and custom interview modes
  window.switchInterviewType = function(type) {
    document.querySelectorAll('.interview-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-type') === type);
    });
    document.getElementById('automaticInterviewMode').style.display = type === 'automatic' ? 'block' : 'none';
    document.getElementById('customInterviewMode').style.display = type === 'custom' ? 'block' : 'none';
  };

  // Custom job form handler
  const customJobForm = document.getElementById('customJobForm');
  if (customJobForm) {
    customJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const customJob = {
        title: document.getElementById('customJobTitle').value.trim(),
        company: document.getElementById('customJobCompany').value.trim(),
        location: document.getElementById('customJobLocation').value.trim(),
        about: document.getElementById('customJobAbout').value.trim(),
        responsibilities: document.getElementById('customJobResponsibilities').value
          .split('\n')
          .map(r => r.replace(/^[-•*]\s*/, '').trim())
          .filter(r => r.length > 0),
        skills: document.getElementById('customJobSkills').value
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        experience: document.getElementById('customJobExperience').value.trim()
      };

      startCustomInterview(customJob);
    });
  }

  function startCustomInterview(jobData) {
    // Reset interview variables
    interviewQuestionCount = 0;
    questionScores = [];
    
    // Mark as custom interview
    jobData.custom = true;
    
    // Calculate match score
    currentJobDetails = jobData;
    currentMatchScore = calculateCustomJobMatch(jobData);
    
    // Switch to chat mode
    chatForm.style.display = 'flex';
    interviewModePanel.style.display = 'none';
    chatLog.innerHTML = '';
    
    // Display welcome message with match score
    const welcomeMessage = `Welcome to the ${jobData.title} interview! 🎤\n\nInitial Match Score: ${currentMatchScore}%\n\nLet's begin with some interview questions.`;
    appendMsg(welcomeMessage, 'bot');
    
    setTimeout(() => generateInterviewQuestion(jobData, 1), 1000);
  }

  function calculateCustomJobMatch(jobData) {
    // Comprehensive match calculation based on actual resume data
    const resumeSkills = extractResumeSkills();
    const jobSkills = jobData.skills || [];
    
    // 1. SKILL MATCH ANALYSIS (50% weight)
    let skillMatches = 0;
    let partialMatches = 0;
    jobSkills.forEach(jobSkill => {
      const jobSkillLower = jobSkill.toLowerCase();
      for (let resumeSkill of resumeSkills) {
        const resumeSkillLower = resumeSkill.toLowerCase();
        if (jobSkillLower === resumeSkillLower) {
          skillMatches++;
          break;
        } else if (jobSkillLower.includes(resumeSkillLower) || resumeSkillLower.includes(jobSkillLower)) {
          partialMatches++;
          break;
        }
      }
    });
    
    const exactSkillScore = jobSkills.length > 0 ? (skillMatches / jobSkills.length) * 100 : 50;
    const partialSkillScore = jobSkills.length > 0 ? (partialMatches / jobSkills.length) * 100 : 0;
    const skillScore = (exactSkillScore * 0.7) + (partialSkillScore * 0.3);
    
    // 2. EXPERIENCE LEVEL (25% weight)
    const resumeLevel = getResumeExperienceLevel();
    const jobLevel = getJobExperienceLevelFromText(jobData.experience);
    const levelAlignment = calculateLevelAlignment(resumeLevel, jobLevel);
    
    // 3. CERTIFICATIONS (15% weight)
    const certRelevance = evaluateCertificateRelevance({ title: jobData.title, skills: jobData.skills, responsibilities: jobData.responsibilities });
    
    // 4. PROJECT EXPERIENCE (10% weight)
    const projectRelevance = evaluateProjectExperience({ title: jobData.title, skills: jobData.skills });
    
    // Calculate weighted final score
    let score = 0;
    score += skillScore * 0.5;
    score += levelAlignment * 0.25;
    score += certRelevance * 0.15;
    score += projectRelevance * 0.1;
    
    // Ensure realistic range (20-92%)
    return Math.min(Math.max(Math.round(score), 20), 92);
  }

  function getJobExperienceLevelFromText(experienceText) {
    const text = experienceText.toLowerCase();
    if (text.includes('0-1') || text.includes('entry') || text.includes('junior') || text.includes('graduate')) return 1;
    else if (text.includes('1-2') || text.includes('2-3')) return 2;
    else if (text.includes('3-5') || text.includes('3+') || text.includes('4+')) return 4;
    else if (text.includes('5-7') || text.includes('5+')) return 5;
    else if (text.includes('7+') || text.includes('10+')) return 7;
    else if (text.includes('senior')) return 5;
    else if (text.includes('lead') || text.includes('principal') || text.includes('architect')) return 7;
    return 3;
  }

  // Interview mode handler
  startInterviewBtn.addEventListener('click', async () => {
    const selectedJob = jobSelect.value;
    if (!selectedJob) {
      appendMsg("Please select a job position first.", 'bot');
      return;
    }
    
    currentInterviewJob = selectedJob;
    
    // Reset interview tracking variables
    interviewQuestionCount = 0;
    questionScores = [];
    currentJobDetails = null;
    
    // Load and parse job file
    try {
      const response = await fetch(selectedJob);
      const jobContent = await response.text();
      const jobDetails = parseJobMarkdown(jobContent);
      currentJobDetails = jobDetails;
      
      // Calculate match score
      currentMatchScore = calculateMatchScore(jobDetails);
      
      // Switch to chat mode
      chatForm.style.display = 'flex';
      interviewModePanel.style.display = 'none';
      chatLog.innerHTML = '';
      
      // Display welcome message
      const welcomeMessage = `Welcome to the ${jobDetails.title} interview! 🎤\n\nCalculating your match score...`;
      appendMsg(welcomeMessage, 'bot');
      
      // Animate match score display over 2 seconds
      const scoreColor = currentMatchScore >= 70 ? '#4CAF50' : currentMatchScore >= 50 ? '#FF9800' : '#f44336';
      const scoreInterpretation = currentMatchScore >= 85 ? "Excellent Match - Strong Candidate" :
                                  currentMatchScore >= 70 ? "Good Match - Well Qualified" :
                                  currentMatchScore >= 55 ? "Moderate Match - Good Foundation" :
                                  currentMatchScore >= 40 ? "Fair Match - Growth Opportunity" :
                                  "Entry Level Match - Stretch Role";
      
      // Animate score from 0 to final score
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      
      const animateScore = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const animatedScore = Math.floor(currentMatchScore * progress);
        
        // Update the last message with animated score
        const lastMsg = chatLog.lastChild;
        if (lastMsg) {
          setMessageContent(lastMsg, `Welcome to the ${jobDetails.title} interview! 🎤\n\n📊 Your Match Score: ${animatedScore}% 🔄`);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        } else {
          // Animation complete, show final message with interpretation
          setMessageContent(lastMsg, `Welcome to the ${jobDetails.title} interview! 🎤\n\n📊 Your Match Score: ${currentMatchScore}% (${scoreInterpretation})\n\nLet's begin with some interview questions!`);
          
          // Start the auto-flow interview with question 1
          setTimeout(() => {
            generateInterviewQuestion(jobDetails, 1);
          }, 1000);
        }
      };
      
      requestAnimationFrame(animateScore);
    } catch (error) {
      appendMsg("Error loading job details. Please try again.", 'bot');
      console.error("Error:", error);
    }
  });

  function parseJobMarkdown(content) {
    const lines = content.split('\n');
    const parsed = {
      title: '',
      company: '',
      location: '',
      type: '',
      responsibilities: [],
      skills: [],
      experience: [],
      salary: ''
    };

    let currentSection = null;

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('# ')) {
        parsed.title = line.replace(/^# /, '').trim();
      } else if (line.startsWith('## Company')) {
        currentSection = 'company';
      } else if (line.startsWith('## Key Responsibilities')) {
        currentSection = 'responsibilities';
      } else if (line.startsWith('## Required Skills')) {
        currentSection = 'skills';
      } else if (line.startsWith('## Experience')) {
        currentSection = 'experience';
      } else if (line.startsWith('- ')) {
        const item = line.replace(/^- /, '').trim();
        if (currentSection === 'responsibilities') {
          parsed.responsibilities.push(item);
        } else if (currentSection === 'skills') {
          parsed.skills.push(item);
        } else if (currentSection === 'experience') {
          parsed.experience.push(item);
        }
      } else if (currentSection === 'company' && line && !line.startsWith('**') && parsed.company === '') {
        parsed.company = line;
      }
    }

    return parsed;
  }

  function generateAnswerFromResume(question, jobDetails, questionNum = 1) {
    const qa = window.resumeData || {};
    const jobSkills = (jobDetails && jobDetails.skills) || [];
    const jobTitle = (jobDetails && jobDetails.title) || '';
    const jobResponsibilities = (jobDetails && jobDetails.responsibilities) || [];

    const langs = (qa.skills?.['Programming Languages'] || []).map(s => typeof s === 'object' ? s.lang : s).filter(Boolean);
    const frameworks = (qa.skills?.['Frameworks & Libraries'] || []).map(s => typeof s === 'object' ? s.name : s).filter(Boolean);
    const techSkills = (qa.skills?.['Technical IT Skills'] || []).map(s => typeof s === 'object' ? s.skill : s).filter(Boolean);
    const certCount = qa.certifications?.length || 0;
    const recentCerts = qa.certifications?.slice(0, 3).map(c => typeof c === 'object' ? c.title : c) || [];
    const affList = qa.affiliations?.length > 0 ? qa.affiliations.map(a => typeof a === 'object' ? `${a.role} at ${a.organization}` : a) : [];
    const recentEvents = qa.events?.slice(0, 3).map(e => typeof e === 'object' ? e.title : e) || [];

    // QUESTION-SPECIFIC ANSWERS - Prioritize by question number/content
    
    // Q1: Technical experience/background
    if (questionNum === 1 || /tell me about your experience|technical background|career|background/i.test(question)) {
      const primarySkills = langs.slice(0, 3).join(', ') || 'various programming languages';
      const secondarySkills = frameworks.slice(0, 2).join(', ') || 'modern frameworks';
      return `My technical background includes ${primarySkills} for programming, and I work with ${secondarySkills} for application development. I've also developed expertise in ${techSkills.slice(0, 2).join(', ')}. Through my ${qa.education?.degree} at ${qa.education?.school}, plus ${certCount} certifications, I've built a solid foundation in software development.`;
    }

    // Q2: Interest in role / Why this position
    if (questionNum === 2 || /interested in|why this role|appeal|attracted to/i.test(question)) {
      const matchingSkills = jobSkills.filter(js => {
        const jsLower = js.toLowerCase();
        return langs.concat(frameworks).some(skill => 
          skill.toLowerCase().includes(jsLower) || jsLower.includes(skill.toLowerCase())
        );
      }).slice(0, 2);
      
      if (matchingSkills.length > 0) {
        return `I'm genuinely interested in this ${jobTitle} role because it aligns perfectly with my skill set. I have direct experience with ${matchingSkills.join(' and ')}, which are core to this position. Beyond the technical fit, I'm excited about ${jobResponsibilities[0]?.toLowerCase() || 'the growth opportunities'} that this role offers, and I believe my ${qa.education?.degree} background combined with my ${certCount} certifications demonstrates my commitment to excellence.`;
      }
      return `What appeals to me about this ${jobTitle} position is the opportunity to apply my ${qa.education?.degree} background and develop new skills. I'm particularly drawn to the responsibility of ${jobResponsibilities[0]?.toLowerCase() || 'driving technical solutions'}. My involvement in ${affList.slice(0, 1).join('and')} has shown me the value of continuous learning, which I see reflected in this role.`;
    }

    // Q3: Learning approach / How you stay current
    if (questionNum === 3 || /approach to learning|stay updated|continuous learning|learning strategies/i.test(question)) {
      const topCerts = recentCerts.slice(0, 2).join(', ') || 'industry certifications';
      return `I approach learning as a continuous journey. I've earned ${certCount} certifications so far, including ${topCerts}, which shows my commitment to staying current with technology trends. I also attend workshops and ${qa.events?.length || 0} tech events to stay engaged with the community. Beyond formal certifications, I contribute to projects like my capstone "${qa.education?.capstone}", where I learn by doing and solving real-world problems on a daily basis.`;
    }

    // Q4: Technical skills / Tech stack proficiency
    if (questionNum === 4 || /experience with|technology stack|technical skills|familiar with/i.test(question)) {
      const allSkills = langs.concat(frameworks).concat(techSkills).filter(Boolean).slice(0, 5).join(', ');
      return `I have hands-on experience with ${allSkills}. Throughout my studies and ${certCount} certifications, I've developed practical skills in both front-end and back-end development. My capstone project "${qa.education?.capstone}" gave me deep exposure to integrating various technologies. I'm confident with the core stack you've mentioned, and I have the foundation to quickly pick up any additional tools your team uses.`;
    }

    // Q5: Overall fit / Why you're the right candidate
    if (questionNum === 5 || /overall fit|why you|best suited|why should we|why you're right/i.test(question)) {
      return `I believe I'm the right fit for this role for several reasons. One, my technical foundation in ${langs.slice(0, 2).join(' and ')} aligns well with your team's needs. Two, my involvement with ${affList.slice(0, 1).join('')} demonstrates that I collaborate well and stay connected to industry best practices. Three, my ${certCount} certifications show I'm proactive about professional development. And finally, working on my capstone "${qa.education?.capstone}" has given me real problem-solving experience that translates directly to ${jobResponsibilities[0]?.toLowerCase() || 'driving solutions'}. I'm ready to contribute from day one and grow with your team.`;
    }

    // Fallback for unexpected questions
    return `I'm ${qa.personal?.name}, a ${qa.education?.degree} student at ${qa.education?.school}. I'm proficient in ${langs.slice(0, 3).join(', ')}, have earned ${certCount} certifications, and I've gained practical experience through projects and community involvement. I'm excited about this opportunity and confident I can add value to your team.`;
  }

  function calculatePerQuestionScore(jobDetails, questionNum, answer = '') {
    try {
      // Get comprehensive match data from actual resume
      let skillScore = 0;
      let levelScore = 0;
      let certScore = 0;
      let projectScore = 0;
      let educationScore = 0;
      
      try {
        skillScore = evaluateSkillMatch(jobDetails);
      } catch (e) {
        console.warn('Error evaluating skill match:', e);
        skillScore = 50;
      }
      
      try {
        levelScore = calculateLevelAlignment(getResumeExperienceLevel(), getJobExperienceLevel(jobDetails)) * 100;
      } catch (e) {
        console.warn('Error calculating level alignment:', e);
        levelScore = 50;
      }
      
      try {
        certScore = evaluateCertificateRelevance(jobDetails) * 100;
      } catch (e) {
        console.warn('Error evaluating certifications:', e);
        certScore = 50;
      }
      
      try {
        projectScore = evaluateProjectExperience(jobDetails) * 100;
      } catch (e) {
        console.warn('Error evaluating projects:', e);
        projectScore = 50;
      }
      
      try {
        educationScore = evaluateEducationMatch(jobDetails) * 100;
      } catch (e) {
        console.warn('Error evaluating education:', e);
        educationScore = 50;
      }
      
      // Evaluate answer quality if provided
      const answerQualityScore = answer ? evaluateAnswerQuality(answer, jobDetails, questionNum) : 70;
      
      let baseScore = 0;
      
      // Distribute scores across questions based on resume strength in each area
      // Now also incorporating answer quality
      switch(questionNum) {
        case 1: 
          // Q1: Technical background - weighted on skill match + education + answer quality
          baseScore = (skillScore * 0.35) + (educationScore * 0.25) + (certScore * 0.15) + (answerQualityScore * 0.25);
          break;
        case 2: 
          // Q2: Interest in role - focus on project experience + answer quality
          baseScore = (projectScore * 0.3) + (skillScore * 0.25) + (certScore * 0.15) + (answerQualityScore * 0.3);
          break;
        case 3: 
          // Q3: Learning approach - focus on certifications + projects + answer quality
          baseScore = (certScore * 0.35) + (projectScore * 0.2) + (skillScore * 0.1) + (answerQualityScore * 0.35);
          break;
        case 4: 
          // Q4: Experience with tech stack - focus on skills + answer quality
          baseScore = (skillScore * 0.4) + (certScore * 0.15) + (levelScore * 0.1) + (answerQualityScore * 0.35);
          break;
        case 5: 
          // Q5: Overall fit - balanced holistic assessment with answer quality
          baseScore = (skillScore * 0.2) + (levelScore * 0.15) + (projectScore * 0.15) + (certScore * 0.1) + (educationScore * 0.1) + (answerQualityScore * 0.3);
          break;
      }
      
      // Apply experience level variance (junior developers can score well on specific areas)
      const experienceMultiplier = getResumeExperienceLevel() === 1 ? 0.85 : 1.0;
      let finalScore = baseScore * experienceMultiplier;
      
      // Add small random variance (±3%) for realism
      const variance = (Math.random() * 6) - 3;
      finalScore += variance;
      
      // Return score between 35-90 for realistic range
      const minScore = getResumeExperienceLevel() === 1 ? 35 : 40;
      const maxScore = currentMatchScore >= 70 ? 88 : 82;
      return Math.min(Math.max(Math.round(finalScore), minScore), maxScore);
    } catch (error) {
      console.error('Critical error calculating question score:', error);
      // Return reasonable default based on match score instead of hardcoded 60
      return currentMatchScore >= 70 ? 72 : currentMatchScore >= 50 ? 60 : 48;
    }
  }

  function evaluateAnswerQuality(answer, jobDetails, questionNum) {
    try {
      if (!answer || answer.length < 10) {
        return 35; // Very short answers score low
      }

      let qualityScore = 50; // Base score

      // Factor 1: Answer length (shows effort and detail)
      // 50-100 chars: +5, 100-200 chars: +10, 200+ chars: +15
      if (answer.length > 200) qualityScore += 15;
      else if (answer.length > 100) qualityScore += 10;
      else if (answer.length > 50) qualityScore += 5;

      // Factor 2: Specific keywords and technical terminology
      const jobKeywords = [];
      if (jobDetails.skills && Array.isArray(jobDetails.skills)) {
        jobDetails.skills.forEach(skill => jobKeywords.push(skill.toLowerCase()));
      }
      if (jobDetails.responsibilities && Array.isArray(jobDetails.responsibilities)) {
        jobDetails.responsibilities.forEach(resp => {
          resp.split(' ').forEach(word => {
            if (word.length > 4) jobKeywords.push(word.toLowerCase());
          });
        });
      }

      const answerLower = answer.toLowerCase();
      let keywordMatches = 0;
      jobKeywords.forEach(keyword => {
        if (answerLower.includes(keyword)) {
          keywordMatches++;
        }
      });

      // +2 points per matching keyword (max +20)
      qualityScore += Math.min(keywordMatches * 2, 20);

      // Factor 3: Specific technical terms that show competence
      const techTerms = [
        'project', 'experience', 'developed', 'implemented', 'designed', 'built',
        'learned', 'github', 'agile', 'team', 'collaborated', 'problem', 'solution',
        'performance', 'tested', 'debugged', 'optimized', 'architecture', 'api',
        'database', 'deployment', 'framework', 'library', 'algorithm'
      ];
      
      let techMatches = 0;
      techTerms.forEach(term => {
        if (answerLower.includes(term)) {
          techMatches++;
        }
      });

      // +1 point per technical term (max +15)
      qualityScore += Math.min(techMatches, 15);

      // Factor 4: Evidence of concrete examples and specificity
      // Look for indicators like specific project names, technologies, metrics
      const hasNumbers = /\d+/.test(answer);
      const hasQuotes = /["']/.test(answer);
      const hasTechnologies = /[A-Z][a-z]+(?:\b|Kit|Script|Script|JS|Hub|Flow)/.test(answer);
      
      if (hasNumbers) qualityScore += 8;
      if (hasTechnologies) qualityScore += 7;
      if (hasQuotes) qualityScore += 5;

      // Factor 5: Answer coherence for specific question types
      switch (questionNum) {
        case 1: // Technical background - should mention skills/projects
          if (answerLower.includes('skill') || answerLower.includes('work') || answerLower.includes('project')) {
            qualityScore += 10;
          }
          break;
        case 2: // Interest in role - should show genuine interest
          if (answerLower.includes('interest') || answerLower.includes('excit') || answerLower.includes('grow')) {
            qualityScore += 10;
          }
          break;
        case 3: // Learning - should mention learning approaches
          if (answerLower.includes('learn') || answerLower.includes('cours') || answerLower.includes('practice')) {
            qualityScore += 10;
          }
          break;
        case 4: // Tech stack - should mention specific technologies
          if (answerLower.includes('language') || answerLower.includes('framework') || answerLower.includes('tool')) {
            qualityScore += 10;
          }
          break;
        case 5: // Overall fit - should tie together multiple aspects
          if ((answerLower.includes('skill') || answerLower.includes('experience')) && 
              (answerLower.includes('team') || answerLower.includes('collaborat'))) {
            qualityScore += 10;
          }
          break;
      }

      // Cap score at 95 to leave room for perfect responses
      return Math.min(Math.max(qualityScore, 25), 95);
    } catch (error) {
      console.warn('Error evaluating answer quality:', error);
      return 60; // Default reasonable score on error
    }
  }

  function evaluateEducationMatch(jobDetails) {
    if (!window.resumeData || !window.resumeData.education) {
      return 0.5;
    }
    
    const edu = window.resumeData.education;
    const jobTitle = (jobDetails.title || '').toLowerCase();
    
    // Check if degree is relevant to job
    const degreeLower = (edu.degree || '').toLowerCase();
    const degreeMatch = degreeLower.includes('computer science') || 
                       degreeLower.includes('information technology') ||
                       degreeLower.includes('software') ? 0.9 : 0.6;
    
    return degreeMatch;
  }

  function evaluateSkillMatch(jobDetails) {
    const resumeSkills = extractResumeSkills();
    const jobSkillsList = parseJobSkills(jobDetails);
    let skillMatches = 0;
    
    for (let jobSkill of jobSkillsList) {
      const jobSkillLower = jobSkill.toLowerCase();
      for (let resumeSkill of resumeSkills) {
        const resumeSkillLower = resumeSkill.toLowerCase();
        if (jobSkillLower === resumeSkillLower || jobSkillLower.includes(resumeSkillLower) || resumeSkillLower.includes(jobSkillLower)) {
          skillMatches++;
          break;
        }
      }
    }
    
    return jobSkillsList.length > 0 ? (skillMatches / jobSkillsList.length) * 100 : 50;
  }

  function animateTyping(element, text, speed = 12, callback = null) {
    let index = 0;
    element.textContent = '';
    element.classList.add('is-typing');
    element.style.display = 'block';

    const typeChar = () => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        setTimeout(typeChar, speed);
      } else {
        // finished typing
        element.classList.remove('is-typing');
        if (callback) callback();
      }
    };
    typeChar();
  }

  function generateInterviewQuestion(jobDetails, questionNum = 1) {
    if (!jobDetails) {
      appendMsg("Error: Unable to load job details. Please refresh and try again.", 'bot');
      return;
    }
    
    if (questionNum > 5) {
      showTyping(false);
      displayInterviewSummary();
      return;
    }

    showTyping(true);
    
    // For custom interviews, fetch job-specific questions
    if (jobDetails.custom) {
      fetchCustomQuestions(jobDetails, questionNum);
    } else {
      // For automatic interviews, use predefined questions
      displayQuestionWithStandardFlow(jobDetails, questionNum);
    }
  }

  function fetchCustomQuestions(jobDetails, questionNum) {
    fetch('/api/generate-custom-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: jobDetails.title,
        skills: jobDetails.skills,
        responsibilities: jobDetails.responsibilities
      })
    })
    .then(res => res.json())
    .then(data => {
      const customQuestions = data.questions || [];
      displayQuestionWithCustomFlow(jobDetails, questionNum, customQuestions);
    })
    .catch(err => {
      console.warn('Error fetching custom questions:', err);
      displayQuestionWithStandardFlow(jobDetails, questionNum);
    });
  }

  function displayQuestionWithCustomFlow(jobDetails, questionNum, questions) {
    showTyping(false);
    
    const question = questions[questionNum - 1] || `Tell me about your experience with ${jobDetails.title}.`;
    
    setTimeout(() => {
      const qMsg = document.createElement('div');
      qMsg.className = 'msg bot';
      qMsg.innerHTML = `<strong>Q${questionNum}:</strong> ${question}`;
      chatLog.appendChild(qMsg);
      chatLog.scrollTop = chatLog.scrollHeight;
      
      setTimeout(() => {
        // Generate answer from resume data
        const answer = generateAnswerFromResume(question, jobDetails, questionNum);
        const qScore = calculatePerQuestionScore(jobDetails, questionNum, answer);
        questionScores.push(qScore);
        
        const aMsg = createExpandableMsg(answer, 'user', 140);
        chatLog.appendChild(aMsg);
        chatLog.scrollTop = chatLog.scrollHeight;

        const previewEl = aMsg.querySelector('.msg-preview') || aMsg;
        const previewText = (answer.length > 140) ? answer.slice(0, 140).trim() : answer;

        animateTyping(previewEl, previewText, 12, () => {
          setTimeout(() => {
            const scoreMsg = document.createElement('div');
            scoreMsg.className = 'msg bot';
            scoreMsg.style.background = '#e3f2fd';
            scoreMsg.style.borderLeft = '4px solid #2563eb';
            scoreMsg.style.color = '#1e40af';
            scoreMsg.style.fontWeight = 'bold';
            scoreMsg.style.textAlign = 'center';
            scoreMsg.style.marginTop = '8px';
            chatLog.appendChild(scoreMsg);
            
            let displayScore = 0;
            const scoreInterval = setInterval(() => {
              displayScore += Math.ceil(qScore / 12);
              if (displayScore >= qScore) {
                displayScore = qScore;
                clearInterval(scoreInterval);
              }
              scoreMsg.textContent = `Q${questionNum} Match: ${displayScore}%`;
              chatLog.scrollTop = chatLog.scrollHeight;
            }, 50);
            
            setTimeout(() => {
              generateInterviewQuestion(jobDetails, questionNum + 1);
            }, 1500);
          }, 300);
        });
      }, 800);
    }, 800);
  }

  function displayQuestionWithStandardFlow(jobDetails, questionNum) {
    showTyping(false);
    
    // Ensure we have a valid match score
    if (typeof currentMatchScore !== 'number' || currentMatchScore === null) {
      currentMatchScore = 60; // Default fallback
    }
    
    const skillName = jobDetails.skills && jobDetails.skills.length > 0 ? jobDetails.skills[0] : 'the required tech stack';
    const respName = jobDetails.responsibilities && jobDetails.responsibilities.length > 0 ? jobDetails.responsibilities[0]?.toLowerCase() : 'solve a complex technical problem';
    
    let questions = [];
    
    // Question sets based on match score
    if (currentMatchScore >= 70) {
      questions = [
        `Tell me about your experience with ${skillName}. How have you applied it in real projects?`,
        `Describe a time when you had to ${respName}. What was your approach?`,
        "What are your most significant technical accomplishments?",
        "How do you approach learning new technologies?",
        "Tell us about your experience with the technologies mentioned in the job description."
      ];
    } else if (currentMatchScore >= 50) {
      questions = [
        `Tell us about your experience with ${skillName || 'software development'}.`,
        "What interests you about this role?",
        "How would you approach learning the skills you don't yet have?",
        `Describe a project where you had to learn something new.`,
        "What can you tell us about our technology stack?"
      ];
    } else {
      questions = [
        "Tell us about yourself and your tech background.",
        "What interests you in transitioning to this role?",
        "What are you willing to learn to succeed in this position?",
        "Describe your approach to solving technical problems.",
        "Why do you think you'd be a good fit despite the experience gap?"
      ];
    }
    
    const question = questions[questionNum - 1];
    
    // Fallback if question index is out of bounds
    if (!question) {
      displayInterviewSummary();
      return;
    }
    
    setTimeout(async () => {
      const qMsg = document.createElement('div');
      qMsg.className = 'msg bot';
      qMsg.innerHTML = `<strong>Q${questionNum}:</strong> ${question}`;
      chatLog.appendChild(qMsg);
      chatLog.scrollTop = chatLog.scrollHeight;
      
      setTimeout(() => {
        const answer = generateAnswerFromResume(question, jobDetails, questionNum);
        const qScore = calculatePerQuestionScore(jobDetails, questionNum, answer);
        questionScores.push(qScore);
        
        const aMsg = createExpandableMsg(answer, 'user', 140);
        chatLog.appendChild(aMsg);
        chatLog.scrollTop = chatLog.scrollHeight;

        const previewEl = aMsg.querySelector('.msg-preview') || aMsg;
        const previewText = (answer.length > 140) ? answer.slice(0, 140).trim() : answer;

        animateTyping(previewEl, previewText, 12, () => {
          setTimeout(() => {
            const scoreMsg = document.createElement('div');
            scoreMsg.className = 'msg bot';
            scoreMsg.style.background = '#e3f2fd';
            scoreMsg.style.borderLeft = '4px solid #2563eb';
            scoreMsg.style.color = '#1e40af';
            scoreMsg.style.fontWeight = 'bold';
            scoreMsg.style.textAlign = 'center';
            scoreMsg.style.marginTop = '8px';
            chatLog.appendChild(scoreMsg);
            
            let displayScore = 0;
            const scoreInterval = setInterval(() => {
              displayScore += Math.ceil(qScore / 12);
              if (displayScore >= qScore) {
                displayScore = qScore;
                clearInterval(scoreInterval);
              }
              scoreMsg.textContent = `Q${questionNum} Match: ${displayScore}%`;
              chatLog.scrollTop = chatLog.scrollHeight;
            }, 50);
            
            setTimeout(() => {
              generateInterviewQuestion(jobDetails, questionNum + 1);
            }, 1500);
          }, 300);
        });
      }, 800);
    }, 800);
  }

  function displayInterviewSummary() {
    const avgScore = Math.round(questionScores.reduce((a, b) => a + b, 0) / questionScores.length);
    
    const summaryMsg = document.createElement('div');
    summaryMsg.className = 'msg bot summary-msg';
    chatLog.appendChild(summaryMsg);
    chatLog.scrollTop = chatLog.scrollHeight;
    
    let content = `✨ Interview Complete! ✨\n\n`;
    content += `📊 Average Match Score: ${avgScore}%\n\n`;
    content += `Question Scores:\n`;
    questionScores.forEach((score, i) => {
      content += `  Q${i + 1}: ${score}%\n`;
    });
    
    animateTyping(summaryMsg, content, 12, () => {
      // Save interview result after animation completes
      saveInterviewResult(currentJobDetails, questionScores, avgScore);
    });
  }

  function saveInterviewResult(jobDetails, scores, avgScore) {
    try {
      const interviewRecord = {
        id: Date.now(),
        jobTitle: jobDetails?.title || 'Unknown Position',
        company: jobDetails?.company || 'Unknown Company',
        date: new Date().toISOString(),
        scores: scores,
        averageScore: avgScore
      };

      // Get existing interviews from localStorage
      let interviews = [];
      const stored = localStorage.getItem('interview_history');
      if (stored) {
        try {
          interviews = JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing interview history:', e);
        }
      }

      // Add new record
      interviews.push(interviewRecord);

      // Save back to localStorage
      localStorage.setItem('interview_history', JSON.stringify(interviews));
      console.log('✅ Interview result saved to localStorage:', interviewRecord);

      // Send to server for persistent backup
      sendInterviewToServer(interviewRecord);
    } catch (error) {
      console.error('Error saving interview result:', error);
    }
  }

  function sendInterviewToServer(interviewRecord) {
    // Attempt to send to server
    fetch('/api/interview-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interviewRecord)
    })
    .then(res => {
      if (!res.ok) {
        console.warn(`⚠️ Server responded with status ${res.status}`);
        throw new Error(`Server returned ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('✅ Interview result backed up to server:', data);
    })
    .catch(err => {
      console.warn('⚠️ Failed to backup interview to server:', err.message);
      console.warn('Will attempt background sync...');
      // Schedule a retry with exponential backoff
      scheduleInterviewSync();
    });
  }

  let syncScheduled = false;
  let syncRetries = 0;
  const MAX_SYNC_RETRIES = 3;

  function scheduleInterviewSync() {
    if (syncScheduled || syncRetries >= MAX_SYNC_RETRIES) return;
    
    syncScheduled = true;
    syncRetries++;
    
    // Retry after 2 seconds
    setTimeout(() => {
      attemptInterviewSync();
    }, 2000 * syncRetries);
  }

  function attemptInterviewSync() {
    try {
      const stored = localStorage.getItem('interview_history');
      if (!stored) {
        syncScheduled = false;
        return;
      }

      const interviews = JSON.parse(stored);
      if (!Array.isArray(interviews) || interviews.length === 0) {
        syncScheduled = false;
        return;
      }

      // Send all interviews to sync endpoint
      fetch('/api/sync-interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviews })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log(`✅ Synced ${data.addedCount} interview records to server`);
          syncScheduled = false;
          syncRetries = 0;
        }
      })
      .catch(err => {
        console.warn('Sync attempt failed:', err.message);
        syncScheduled = false;
        // Could retry again if needed
      });
    } catch (error) {
      console.error('Error during sync attempt:', error);
      syncScheduled = false;
    }
  }

  // Auto-sync on page visibility change (when user returns to tab)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && syncRetries > 0) {
        console.log('Page became visible, attempting sync...');
        attemptInterviewSync();
      }
    });
  }

  function getInterviewHistory() {
    try {
      const stored = localStorage.getItem('interview_history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving interview history:', error);
      return [];
    }
  }

  function calculateInterviewStats(interviews) {
    if (!interviews || interviews.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      };
    }

    const scores = interviews.map(i => i.averageScore);
    const total = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round((total / scores.length) * 10) / 10;

    return {
      totalInterviews: interviews.length,
      averageScore: avg,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores)
    };
  }

  function appendMsg(text, who='bot'){
    const msgEl = createExpandableMsg(text, who);
    chatLog.appendChild(msgEl);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function createExpandableMsg(text, who='bot', previewLen = 140) {
    const el = document.createElement('div'); el.className = `msg ${who}`;

    const preview = document.createElement('div'); preview.className = 'msg-preview';
    const full = document.createElement('div'); full.className = 'msg-full';
    full.style.display = 'none';

    if (!text || text.length <= previewLen) {
      preview.textContent = text;
      el.appendChild(preview);
      return el;
    }

    const short = text.slice(0, previewLen).trim();
    preview.textContent = short + '\u2026'; // ellipsis
    // store full text for later reveal
    full.dataset.full = text;

    const more = document.createElement('div'); more.className = 'read-more'; more.textContent = 'Read more';
    more.style.color = 'var(--primary)'; more.style.fontSize = '11px'; more.style.marginTop = '6px';

    el.appendChild(preview);
    el.appendChild(full);
    el.appendChild(more);

    el.addEventListener('click', function toggleExpanded(e) {
      // avoid expanding when clicking links or inputs in future
      if (el.classList.contains('expanded')) {
        // collapse
        full.style.display = 'none';
        preview.style.display = '';
        more.textContent = 'Read more';
        el.classList.remove('expanded');
      } else {
        // expand: show full text (no typing to keep UX snappy)
        full.textContent = full.dataset.full || '';
        full.style.display = '';
        preview.style.display = 'none';
        more.textContent = 'Show less';
        el.classList.add('expanded');
      }
      chatLog.scrollTop = chatLog.scrollHeight;
    });

    return el;
  }

  // Utility to safely replace the last message content (used by animated score)
  function setMessageContent(msgEl, text) {
    if (!msgEl) return;
    const preview = msgEl.querySelector('.msg-preview');
    const full = msgEl.querySelector('.msg-full');
    if (preview && full) {
      // update both preview and stored full
      const previewLen = 140;
      if (text.length <= previewLen) {
        preview.textContent = text; full.dataset.full = text; full.textContent = '';
      } else {
        preview.textContent = text.slice(0, previewLen).trim() + '\u2026';
        full.dataset.full = text;
        if (msgEl.classList.contains('expanded')) {
          full.textContent = text;
        } else {
          full.textContent = '';
        }
      }
    } else {
      // fallback - replace textContent
      msgEl.textContent = text;
    }
  }

  function showTyping(show){
    let el = chatLog.querySelector('.typing');
    if (show) {
      if (!el) {
        el = document.createElement('div');
        el.className = 'typing';
        el.innerHTML = `
          <div class="typing-spinner">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        `;
        chatLog.appendChild(el);
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    } else {
      if (el) {
        el.style.animation = 'fadeOut 0.2s ease-out forwards';
        setTimeout(() => el.remove(), 200);
      }
    }
  }

  function ensurePanelVisible(){
    // Position the panel above the chat toggle when possible.
    requestAnimationFrame(()=>{
      const pad = 12; // minimal padding from edges
      const toggleRect = chatToggle.getBoundingClientRect();
      const panelRect = chatPanel.getBoundingClientRect();
      const availableAbove = toggleRect.top - pad; // space above toggle
      const availableBelow = window.innerHeight - (toggleRect.bottom) - pad; // space below toggle

      // prefer to place panel above the toggle (so messages sit above the icon)
      if (panelRect.height <= availableAbove) {
        // set bottom so panel's bottom aligns slightly above toggle top
        const bottom = window.innerHeight - toggleRect.top + 8; // small gap
        chatPanel.style.top = 'auto';
        chatPanel.style.bottom = `${bottom}px`;
      } else if (panelRect.height <= availableBelow) {
        // if it fits below, place below
        const top = toggleRect.bottom + 8;
        chatPanel.style.bottom = 'auto';
        chatPanel.style.top = `${top}px`;
      } else {
        // otherwise anchor to top with padding
        chatPanel.style.bottom = 'auto';
        chatPanel.style.top = `${pad}px`;
        // reduce max-height to fit if necessary
        chatPanel.style.maxHeight = `calc(100vh - ${pad * 2}px)`;
      }

      // keep horizontal alignment near the toggle (respect any right offset)
      const rightOffset = Math.max(8, window.innerWidth - toggleRect.right + 8);
      chatPanel.style.right = `${rightOffset}px`;
    });
  }

  function answerQuery(q){
    const s = q.toLowerCase();
    // personal
    if (/(birth|born|birthplace|birth date|birthday)/.test(s)) return `I was born on ${resume.personal.birthDate} in ${resume.personal.birthplace}! 🎂`;
    if (/(email|e-mail|contact|reach)/.test(s)) return `Sure! You can reach me at ${resume.personal.email}. I'm based in ${resume.personal.address}. 😊`;
    if (/(gender)/.test(s)) return `I'm ${resume.personal.gender}!`;
    if (/(citizen|nationality)/.test(s)) return `I'm ${resume.personal.citizenship}! 🇵🇭`;
    if (/(religion|faith)/.test(s)) return `I'm ${resume.personal.religion}. ✝️`;
    if (/(address|live|location|where)/.test(s)) return `I'm based in ${resume.personal.address}! It's home. 🏠`;
    if (/(capstone|thesis|project)/.test(s)) return `Oh, my capstone project is "${resume.education.capstone}"! It's been a really interesting experience. 😄`;
    if (/(degree|studying|education|school)/.test(s)) {
      return `I'm currently pursuing a ${resume.education.degree} at ${resume.education.school} (${resume.education.years}). My capstone project is "${resume.education.capstone}" — it's been great! Before this, I did Senior High at ${resume.education.shs.school} (${resume.education.shs.years}) and Junior High at ${resume.education.jhs.school} (${resume.education.jhs.years}).`;
    }
    if (/(certif|certificate|credential|training)/.test(s)) {
      if (/list|all/.test(s)) {
        const certList = resume.certifications.map(c => c.title).join('\n- ');
        return `I've got ${resume.certifications.length} certifications! Here they are:\n- ${certList}`;
      }
      const recentCerts = resume.certifications.slice(0, 3).map(c => `${c.title} from ${c.org} (${c.date})`);
      return `I've earned ${resume.certifications.length} certifications so far! Here are a few recent ones:\n- ${recentCerts.join('\n- ')}`;
    }
    if (/(skill|technical|programming|framework|language|tech stack)/.test(s)) {
      let skillsInfo = 'Here\'s what I work with! 💻\n\n';
      if (resume.skills) {
        Object.entries(resume.skills).forEach(([category, skillList]) => {
          if (Array.isArray(skillList) && skillList.length > 0) {
            const skills = skillList.map(sk => typeof sk === 'string' ? sk : sk.lang || sk.name || sk.skill || sk.area || sk.system || '').filter(Boolean).join(', ');
            if (skills) skillsInfo += `**${category}:** ${skills}\n\n`;
          }
        });
      }
      return skillsInfo;
    }
    if (/(affiliat|organization|member|group|role)/.test(s)) {
      if (resume.affiliations && resume.affiliations.length > 0) {
        const allAff = resume.affiliations.map(a => `${a.role} at ${a.organization} (${a.period})`).join('\n- ');
        return `I'm part of a few organizations! Here are my roles:\n- ${allAff}`;
      }
      return `Hmm, I don't have affiliation info to share on that one!`;
    }
    // events by title
    for(const ev of resume.events){ 
      if (s.includes(ev.title.toLowerCase().slice(0,20))) {
        return `Oh yeah, "${ev.title}"! That was at ${ev.venue} on ${ev.date}. ${ev.desc || ''}`;
      }
    }
    // events general
    if (/(event|seminar|workshop|conference|attend)/.test(s)) {
      if (/list|all/.test(s)) {
        const eventList = resume.events.map(e => `${e.title} at ${e.venue} (${e.date})`).join('\n- ');
        return `I've been to ${resume.events.length} events! Here's the full list:\n- ${eventList}`;
      }
      const recentEvents = resume.events.slice(0, 3).map(e => `${e.title} at ${e.venue} (${e.date})`);
      return `I've attended ${resume.events.length} events so far! Here are a few recent ones:\n- ${recentEvents.join('\n- ')}`;
    }
    if (/(tell me about|who are you|introduce)/.test(s)) {
      return `Hey there! 👋 I'm ${resume.personal.name}. I'm currently pursuing a ${resume.education.degree} at ${resume.education.school} (${resume.education.years}). My capstone is "${resume.education.capstone}". So far, I've earned ${resume.certifications.length} certifications and attended ${resume.events.length} events!`;
    }

    return `Hey! Feel free to ask me about my background, education, skills, certifications, events, or affiliations — I'd love to chat! 😊`;
  }

  async function queryServer(message){
    try{
      const res = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
      if(!res.ok) throw new Error('server');
      const j = await res.json();
      return j.reply || j.result || JSON.stringify(j);
    }catch(e){
      return null;
    }
  }

  chatForm.addEventListener('submit', async (ev) => {
    ev.preventDefault(); const val = chatInput.value.trim(); if (!val) return;
    appendMsg(val, 'user');
    chatInput.value = '';
    chatInput.disabled = true;
    showTyping(true);
    ensurePanelVisible();

    // Determine response based on mode
    if (currentMode === 'interview') {
      // Interview mode: provide match-aware feedback and ask next question
      setTimeout(() => {
        showTyping(false);
        chatInput.disabled = false;
        
        let feedbackMessages = [];
        
        // Tailor feedback based on match score
        if (currentMatchScore >= 70) {
          feedbackMessages = [
            "Excellent technical insight! Let's explore another area:",
            "That demonstrates strong expertise. Here's my next question:",
            "Great articulation of that concept. Moving on:",
            "I appreciate the depth of your knowledge. Let's continue:"
          ];
        } else if (currentMatchScore >= 50) {
          feedbackMessages = [
            "Good answer! Here's another question to explore:",
            "I see your perspective. Let me ask about:",
            "That's solid. Let's dig deeper into:",
            "Thanks for that response. Next question:"
          ];
        } else {
          feedbackMessages = [
            "I appreciate your willingness to learn. Let's explore further:",
            "Good starting point. Here's another area we should cover:",
            "That's helpful context. Moving to the next topic:",
            "Let's continue building your understanding:"
          ];
        }
        
        const feedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
        appendMsg(feedback, 'bot');
        generateInterviewQuestion(currentInterviewJob);
      }, 800);
    } else {
      // Q&A mode: normal response
      const serverResp = await queryServer(val);
      showTyping(false);
      chatInput.disabled = false;
      if(serverResp){ appendMsg(serverResp, 'bot'); return; }
      const resp = answerQuery(val);
      appendMsg(resp, 'bot');
    }
  });

  // Populate job selector with company names
  async function populateJobSelector() {
    const jobs = [
      'jobs/01_junior_software_developer_linkedin.md',
      'jobs/02_full_stack_developer_indeed.md',
      'jobs/03_frontend_engineer_seek.md',
      'jobs/04_devops_engineer_linkedin.md',
      'jobs/05_qa_test_engineer_seek.md'
    ];

    for (const jobPath of jobs) {
      try {
        const response = await fetch(jobPath);
        const jobContent = await response.text();
        const jobDetails = parseJobMarkdown(jobContent);
        
        // Create option with title and company
        const option = document.createElement('option');
        option.value = jobPath;
        option.textContent = `${jobDetails.title} - ${jobDetails.company}`;
        jobSelect.appendChild(option);
      } catch (error) {
        console.error(`Error loading ${jobPath}:`, error);
      }
    }
  }

  // Populate job selector on load
  populateJobSelector();

  // Initialize with default Q&A mode
  appendMsg("Hello! I'm your Digital Twin AI assistant. Ask me anything about your background.", 'bot');

  // reposition on resize to avoid clipping
  window.addEventListener('resize', ensurePanelVisible);
  // ensure panel visible on open
  chatToggle.addEventListener('click', () => { setTimeout(ensurePanelVisible, 80); });

})();
