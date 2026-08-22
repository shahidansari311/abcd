const llmClient = require('./llmClient');
const embeddingClient = require('./embeddingClient');
const vectorDb = require('../config/vectorDb');

/**
 * Basic RAG Pipeline
 * 1. Embed the query
 * 2. Search Vector DB for context
 * 3. Generate completion with context
 */
const runQuery = async (query, promptTemplate) => {
  // 1. Embed
  const queryVector = await embeddingClient.generateEmbedding(query);

  // 2. Retrieve
  const contexts = await vectorDb.search(queryVector, 3);
  const contextText = contexts.map(c => JSON.stringify(c.metadata)).join('\n');

  // 3. Generate
  const prompt = promptTemplate.replace('{{CONTEXT}}', contextText).replace('{{QUERY}}', query);
  const response = await llmClient.generateCompletion(prompt);

  return {
    response,
    contexts
  };
};

module.exports = {
  runQuery
};
