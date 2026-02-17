require('dotenv').config();
const path = require('path');

(async function run() {
  try {
    const embeddings = require(path.join(__dirname, '..', '..', 'embeddings.js'));
    if (typeof embeddings.upsertAllSections !== 'function') {
      console.error('embeddings.upsertAllSections not found in embeddings.js');
      process.exit(1);
    }
    console.log('Starting ingest pipeline (embeddings.upsertAllSections)');
    await embeddings.upsertAllSections();
    console.log('Ingest finished');
    process.exit(0);
  } catch (err) {
    console.error('Ingest error:', err.message);
    process.exit(1);
  }
})();
