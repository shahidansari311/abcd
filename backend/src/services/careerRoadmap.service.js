const ragPipeline = require('../ai/ragPipeline');
const { roadmapPrompt } = require('../ai/prompts/roadmap.prompt');

const generateRoadmap = async (gaps, targetRole) => {
  const query = `Target Role: ${targetRole}. Gaps: ${JSON.stringify(gaps)}`;
  const { response } = await ragPipeline.runQuery(query, roadmapPrompt);
  
  // Parse the JSON string returned by the mock LLM
  try {
    return JSON.parse(response);
  } catch (error) {
    return { error: 'Failed to parse roadmap generation output' };
  }
};

module.exports = {
  generateRoadmap,
};
