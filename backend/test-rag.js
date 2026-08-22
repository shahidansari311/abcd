require('dotenv').config();
const ragPipeline = require('./src/ai/ragPipeline');
const vectorDb = require('./src/config/vectorDb');
const embeddingClient = require('./src/ai/embeddingClient');

async function testRAG() {
  console.log("Setting up Vector DB...");
  await vectorDb.connect();

  console.log("Inserting fake job descriptions into DB...");
  const jobs = [
    "We are looking for a frontend developer who knows React, Tailwind, and Vite.",
    "Data Scientist required. Must know Python, Pandas, and SQL.",
    "Backend Engineer wanted. Must be proficient in Node.js, Express, and MongoDB."
  ];

  for (let i = 0; i < jobs.length; i++) {
    const vector = await embeddingClient.generateEmbedding(jobs[i]);
    await vectorDb.insert(i, vector, { text: jobs[i], type: "job" });
  }

  console.log("Running RAG Query...");
  const promptTemplate = "Context: {{CONTEXT}}\n\nUser Question: {{QUERY}}\n\nAnswer:";
  const result = await ragPipeline.runQuery("What skills do I need to be a backend engineer?", promptTemplate);
  
  console.log("\n--- RAG Result ---");
  console.log("Retrieved Context:", result.contexts.map(c => c.metadata.text));
  console.log("AI Answer:\n", result.response);
  process.exit(0);
}

testRAG();
