/**
 * Mock Embedding Client
 * In production, this would call an embedding model API (e.g., text-embedding-ada-002).
 */
const generateEmbedding = async (text) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return a mock vector of length 1536 (standard for many models) filled with random numbers
  return Array.from({ length: 1536 }, () => Math.random() - 0.5);
};

module.exports = {
  generateEmbedding
};
