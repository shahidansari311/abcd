const logger = require('./logger');

// Mock in-memory vector DB for Phase 2 local development
class MockVectorDB {
  constructor() {
    this.vectors = new Map();
  }

  async connect() {
    logger.info('Mock Vector DB connected');
  }

  async insert(id, vector, metadata = {}) {
    this.vectors.set(id, { vector, metadata });
    return true;
  }

  async search(queryVector, limit = 5) {
    // In a real DB this computes cosine similarity.
    // For our mock, we just return the first 'limit' items.
    const results = Array.from(this.vectors.values()).slice(0, limit);
    return results.map(r => ({ ...r, score: Math.random() * 0.5 + 0.5 })); // Mock score 0.5 - 1.0
  }
}

const vectorDb = new MockVectorDB();
vectorDb.connect();

module.exports = vectorDb;
