/**
 * Embeddings Pipeline for Digital Twin Resume
 * 
 * This script:
 * 1. Extracts text from resume data into structured sections
 * 2. Upserts sections to Upstash Vector Database (embedding handled by Upstash BM25 model)
 * 3. Enables semantic search via /api/search endpoint
 */

require('dotenv').config();
const { Index } = require('@upstash/vector');

// Initialize Upstash Vector client
const upstashVectorUrl = process.env.UPSTASH_VECTOR_REST_URL;
const upstashVectorToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

if (!upstashVectorUrl || !upstashVectorToken) {
  console.error('❌ Error: UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be set in .env');
  process.exit(1);
}

const index = new Index({
  url: upstashVectorUrl,
  token: upstashVectorToken,
});

// Resume data (same structure as data.js)
const resumeData = {
  personal: {
    name: "Jacinto Gabriel A. Tong",
    degree: "Bachelor of Science in Computer Science",
    birthDate: "November 25, 2004",
    birthplace: "Manila, Philippines",
    gender: "Male",
    citizenship: "Filipino",
    religion: "Roman Catholic",
    address: "Quezon City, Philippines",
    email: "jacinto.tong@example.com"
  },
  education: {
    degree: "Bachelor of Science in Computer Science",
    school: "Polytechnic University of the Philippines",
    years: "2022-2026",
    capstone: "Digital Twin Resume Platform with AI Chatbot",
    SHS: "De La Salle University – Dasmariñas (STEM)",
    JHS: "De La Salle University – Dasmariñas"
  },
  certifications: [
    "AWS Certified Cloud Practitioner",
    "Google Cloud Associate Cloud Engineer",
    "Microsoft Azure Fundamentals (AZ-900)",
    "CompTIA Security+",
    "CompTIA Network+",
    "Cisco CCNA Routing and Switching",
    "Oracle SQL Developer",
    "MongoDB Associate Developer",
    "Kubernetes Application Developer (CKAD)",
    "Docker Certified Associate",
    "HashiCorp Certified: Terraform Associate",
    "Advanced JavaScript Developer",
    "Full-Stack Web Development Bootcamp",
    "Machine Learning with Python",
    "Data Science Professional Certificate",
    "AI for Business Professional Certificate",
    "IBM Data Science Professional Certificate",
    "Google Analytics Certification",
    "Web Development Fundamentals",
    "RESTful API Design",
    "GraphQL Fundamentals",
    "TypeScript Advanced",
    "React Advanced Patterns",
    "Vue.js Certification",
    "Node.js Developer Certification",
    "Python for Data Analysis",
    "Agile and Scrum Master Certification",
    "Project Management Professional (PMP)",
    "Business Analysis Fundamentals",
    "UX/UI Design Certification",
    "Digital Marketing Specialist",
    "Technical Writing Course"
  ],
  events: [
    { title: "Tech Summit 2024", venue: "SMX Convention Center, Manila", date: "March 15, 2024" },
    { title: "Python Workshop", venue: "Tech Hub Manila", date: "April 10, 2024" },
    { title: "Cloud Architecture Conference", venue: "Makati Shangri-La, Manila", date: "May 20, 2024" },
    { title: "Web Development Bootcamp", venue: "UPLIFT PH, Quezon City", date: "June 5, 2024" },
    { title: "AI & Machine Learning Summit", venue: "BGC, Taguig", date: "July 12, 2024" },
    { title: "DevOps Day Asia", venue: "SMX Convention Center, Manila", date: "August 18, 2024" },
    { title: "React Advanced Workshop", venue: "Tech Hub Manila", date: "September 22, 2024" },
    { title: "Kubernetes Training Seminar", venue: "UPLIFT PH, Quezon City", date: "October 8, 2024" },
    { title: "Data Science Conference", venue: "Makati Shangri-La, Manila", date: "November 14, 2024" },
    { title: "Full-Stack JavaScript Bootcamp", venue: "Tech Hub Manila", date: "December 3, 2024" },
    { title: "TypeScript Advanced Certification Course", venue: "Online", date: "January 10, 2025" },
    { title: "GraphQL for Modern Web Apps", venue: "BGC, Taguig", date: "February 7, 2025" },
    { title: "Cloud Security Best Practices", venue: "SMX Convention Center, Manila", date: "March 14, 2025" },
    { title: "AI Ethics and Responsible AI", venue: "PUP Campus, Quezon City", date: "April 9, 2025" },
    { title: "DevSecOps Implementation Workshop", venue: "Tech Hub Manila", date: "May 16, 2025" },
    { title: "Enterprise Architecture Summit", venue: "Makati Shangri-La, Manila", date: "June 20, 2025" },
    { title: "Open Source Contribution Workshop", venue: "UPLIFT PH, Quezon City", date: "July 25, 2025" },
    { title: "Microservices Design Patterns", venue: "BGC, Taguig", date: "August 29, 2025" },
    { title: "API Security and Rate Limiting", venue: "Tech Hub Manila", date: "September 18, 2025" },
    { title: "Vector Databases for AI", venue: "Online", date: "October 10, 2025" },
    { title: "Production ML Systems Workshop", venue: "SMX Convention Center, Manila", date: "November 12, 2025" }
  ],
  affiliations: [
    "IEEE Student Member - Computer Society",
    "Google Developer Groups (GDG) Manila Co-Organizer",
    "Python Philippines Community Contributor",
    "Open Source Contributors PH Ambassador",
    "Cloud Native Community (CNCF) Student Representative"
  ]
};

/**
 * Extract all text fields and create document chunks
 */
function extractResumeSections() {
  const sections = [];

  // Personal data
  Object.entries(resumeData.personal).forEach(([key, value]) => {
    if (value) {
      sections.push({
        id: `personal_${key}`,
        data: `Personal: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is ${value}`,
        metadata: { category: 'personal', field: key }
      });
    }
  });

  // Education
  Object.entries(resumeData.education).forEach(([key, value]) => {
    if (value) {
      sections.push({
        id: `education_${key}`,
        data: `Education: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} - ${value}`,
        metadata: { category: 'education', field: key }
      });
    }
  });

  // Certifications
  resumeData.certifications.forEach((cert, index) => {
    sections.push({
      id: `cert_${index}`,
      data: `Certification: ${cert}`,
      metadata: { category: 'certifications', index }
    });
  });

  // Events
  resumeData.events.forEach((event, index) => {
    sections.push({
      id: `event_${index}`,
      data: `Event: ${event.title} at ${event.venue} on ${event.date}`,
      metadata: { category: 'events', index }
    });
  });

  // Affiliations
  resumeData.affiliations.forEach((affiliation, index) => {
    sections.push({
      id: `affiliation_${index}`,
      data: `Affiliation: ${affiliation}`,
      metadata: { category: 'affiliations', index }
    });
  });

  return sections;
}

/**
 * Main function to upsert all sections using Upstash-native embedding
 */
async function upsertAllSections() {
  console.log('📊 Extracting resume sections...');
  const sections = extractResumeSections();
  console.log(`✅ Extracted ${sections.length} sections\n`);

  console.log('🔄 Upserting sections to Upstash Vector Database...\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    try {
      console.log(`[${i + 1}/${sections.length}] ${section.id}`);
      
      // Upsert to Upstash - Upstash handles embedding via BM25 model
      await index.upsert({
        id: section.id,
        data: section.data,
        metadata: section.metadata
      });
      
      successCount++;
      console.log(`  ✅ Upserted to Upstash`);
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Error: ${error.message}`);
    }
    
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log(`\n📈 Results:`);
  console.log(`  ✅ Successfully upserted: ${successCount} vectors`);
  console.log(`  ❌ Failed: ${errorCount} vectors`);
  console.log(`  📊 Total: ${sections.length} sections processed`);
}

// Run the pipeline
if (require.main === module) {
  upsertAllSections()
    .then(() => {
      console.log('\n✨ Embedding pipeline completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = { extractResumeSections };
