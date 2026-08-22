const logger = require('./logger');

// Helper to compute cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Simple In-Memory Vector DB for Development
// Replaces the previous mock implementation with real mathematical similarity search
class MemoryVectorDB {
  constructor() {
    this.vectors = new Map();
  }

  async connect() {
    logger.info('Memory Vector DB connected (Cosine Similarity Enabled)');
  }

  async insert(id, vector, metadata = {}) {
    this.vectors.set(id.toString(), { vector, metadata });
    return true;
  }

  async search(queryVector, limit = 5) {
    const results = [];
    
    for (const [id, data] of this.vectors.entries()) {
      const score = cosineSimilarity(queryVector, data.vector);
      results.push({
        id,
        metadata: data.metadata,
        score
      });
    }

    // Sort by highest score first and slice
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}

const vectorDb = new MemoryVectorDB();
vectorDb.connect();

module.exports = vectorDb;
