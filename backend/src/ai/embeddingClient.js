const { HfInference } = require('@huggingface/inference');
const env = require('../config/env');

// Initialize Hugging Face Inference API
const hf = new HfInference(env.HUGGINGFACE_API_KEY || '');

/**
 * Real Embedding Client using Hugging Face
 * Model: sentence-transformers/all-MiniLM-L6-v2
 * Returns: Array of 384 numbers
 */
const generateEmbedding = async (text) => {
  if (!env.HUGGINGFACE_API_KEY) {
    console.warn("WARNING: No HUGGINGFACE_API_KEY found. Falling back to mock embeddings.");
    return Array.from({ length: 384 }, () => Math.random() - 0.5);
  }

  try {
    const output = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });
    
    // The model returns a 1D array of embeddings for a single string input
    return output;
  } catch (error) {
    console.error("Hugging Face Embedding Error:", error);
    // Fallback so the app doesn't crash during development
    return Array.from({ length: 384 }, () => Math.random() - 0.5);
  }
};

module.exports = {
  generateEmbedding
};
