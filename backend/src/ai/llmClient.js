/**
 * Mock LLM Client
 * In production, this would call OpenAI/Anthropic/Gemini APIs.
 */
const generateCompletion = async (prompt, options = {}) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // If it's a roadmap prompt, return a structured JSON response
  if (prompt.includes('roadmap')) {
    return JSON.stringify({
      roadmap: [
        {
          step: 1,
          title: "Master Fundamentals",
          description: "Focus on closing foundational gaps based on your assessment.",
          resources: ["Resource A", "Resource B"]
        },
        {
          step: 2,
          title: "Build Projects",
          description: "Apply your skills to build evidence.",
          resources: ["Challenge C"]
        }
      ],
      estimatedTime: "3 months"
    });
  }

  return "This is a mock LLM response based on the prompt.";
};

module.exports = {
  generateCompletion
};
