const fetch = require('node-fetch');

fetch('https://digital-twin-spup-i7bh.vercel.app/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'query', query: 'degree', k: 5 })
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
.catch(e => console.error('Error:', e.message));
