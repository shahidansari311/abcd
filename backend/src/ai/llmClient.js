const Groq = require('groq-sdk');
const env = require('../config/env');

const groq = new Groq({
  apiKey: env.GROQ_API_KEY || 'dummy_key' // Don't crash if undefined, we handle it below
});

/**
 * Real LLM Client using Groq
 * Model: llama3-8b-8192
 */
const generateCompletion = async (prompt, options = {}) => {
  if (!env.GROQ_API_KEY) {
    console.warn("WARNING: No GROQ_API_KEY found. Falling back to mock LLM.");
    if (prompt.includes('roadmap')) {
      return JSON.stringify({
        roadmap: [
          {
            step: 1,
            title: "Master Fundamentals",
            description: "Focus on closing foundational gaps based on your assessment.",
            resources: ["Resource A", "Resource B"]
          }
        ],
        estimatedTime: "3 months"
      });
    }
    return "This is a mock LLM response because no Groq API key was provided.";
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are the Skill Bridge AI Mentor. Provide helpful, structured, and extremely fast advice to students.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1024,
      response_format: prompt.includes('roadmap') ? { type: 'json_object' } : { type: 'text' }
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq LLM Error:", error);
    return "I'm sorry, I am currently experiencing connection issues to the AI server.";
  }
};

const getGroqChatCompletion = async (messages, options = {}) => {
  if (!env.GROQ_API_KEY) {
    console.warn("WARNING: No GROQ_API_KEY found. Falling back to mock LLM.");
    return {
      choices: [{ message: { content: "This is a mock LLM response because no Groq API key was provided." } }]
    };
  }
  return groq.chat.completions.create({
    messages,
    model: 'llama3-8b-8192',
    temperature: 0.7,
    max_tokens: 1024,
    ...options
  });
};

module.exports = {
  generateCompletion,
  getGroqChatCompletion
};
