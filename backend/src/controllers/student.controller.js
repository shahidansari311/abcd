const studentService = require('../services/student.service');
const apiResponse = require('../utils/apiResponse');
const { getGroqChatCompletion } = require('../ai/llmClient');
const SkillProfile = require('../models/SkillProfile.model');

const getProfile = async (req, res) => {
  const student = await studentService.getProfile(req.user.id);
  return apiResponse(res, 200, true, 'Profile fetched successfully', { student });
};

const updateProfile = async (req, res) => {
  const student = await studentService.updateProfile(req.user.id, req.body);
  return apiResponse(res, 200, true, 'Profile updated successfully', { student });
};

const chatWithAgent = async (req, res) => {
  const { message, history = [] } = req.body;
  const studentId = req.user.id;

  // 1. Fetch Student Data
  const student = await studentService.getProfile(studentId);
  const skillProfile = await SkillProfile.findOne({ student: studentId });

  // 2. Format Context for the AI
  const skillsContext = skillProfile && skillProfile.skills.length > 0 
    ? skillProfile.skills.map(s => `${s.name}: ${s.score}% (Verified: ${s.isVerified})`).join(', ')
    : 'No skills added yet.';

  const systemPrompt = `You are an expert AI Career Agent for ${student.firstName}. 
Your goal is to provide highly personalized, actionable advice based ONLY on their actual profile.
Do not give generic advice. Refer to their current skills and readiness score.
Student Profile:
- Degree: ${student.degree || 'Not specified'}
- Readiness Score: ${student.readinessScore}%
- Current Skills: ${skillsContext}

Guidelines:
- Keep answers concise and encouraging.
- Recommend specific next steps (e.g. learning a missing skill, doing a project to verify a skill).
- If they ask about a role, compare their skills to what's typically required.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];

  try {
    const aiResponse = await getGroqChatCompletion(messages);
    const reply = aiResponse.choices[0]?.message?.content || "I'm having trouble thinking right now. Please try again later.";
    return apiResponse(res, 200, true, 'AI response generated', { reply });
  } catch (err) {
    console.error("Groq Error:", err);
    return apiResponse(res, 500, false, 'Failed to generate AI response');
  }
};

const simulateReadiness = async (req, res) => {
  const { hours, timeframe, focusArea } = req.body;
  const studentId = req.user.id;

  const student = await studentService.getProfile(studentId);
  const baseScore = student.readinessScore || 58;
  
  // Real math logic matching the frontend logic closely, but computed securely on backend
  const effort = (hours / 40) * (timeframe / 12) * 60;
  const newReadinessScore = Math.min(99, Math.round(baseScore + effort));

  const boost = (hours * timeframe) / 12;
  const focusBonus = (areaName) => (focusArea === areaName ? 18 : 0);

  const skills = [
    { label: "Machine Learning", value: Math.min(99, Math.round(45 + boost + focusBonus("Machine Learning"))) },
    { label: "Cloud (AWS)", value: Math.min(99, Math.round(38 + boost + focusBonus("Cloud"))) },
    { label: "Statistics", value: Math.min(99, Math.round(58 + boost * 0.6 + focusBonus("Statistics"))) },
    { label: "Communication", value: Math.min(99, Math.round(84 + boost * 0.3 + focusBonus("Communication"))) },
  ];

  return apiResponse(res, 200, true, 'Simulation complete', { 
    projectedScore: newReadinessScore,
    skills
  });
};

const generateRoadmap = async (req, res) => {
  const studentId = req.user.id;
  const student = await studentService.getProfile(studentId);
  const skillProfile = await SkillProfile.findOne({ student: studentId });

  const skillsContext = skillProfile && skillProfile.skills.length > 0 
    ? skillProfile.skills.map(s => `${s.name}: ${s.score}%`).join(', ')
    : 'No skills added yet.';

  const systemPrompt = `You are an expert AI Career Advisor for ${student.firstName}. 
Generate a JSON array of exact 5 career milestones for them to reach a Data Scientist or related role.
Their current skills: ${skillsContext}.
Return ONLY a valid JSON array of objects with the exact structure:
[
  { "title": "Milestone Name", "status": "done" | "current" | "upcoming", "desc": "Brief 1-sentence description" }
]
At least one should be "current". Prioritize what they are lacking.`;

  try {
    const aiResponse = await getGroqChatCompletion([{ role: 'system', content: systemPrompt }]);
    const replyText = aiResponse.choices[0]?.message?.content || "[]";
    const jsonMatch = replyText.match(/\[.*\]/s);
    let milestones = [];
    if (jsonMatch) {
      milestones = JSON.parse(jsonMatch[0]);
    } else {
      milestones = JSON.parse(replyText);
    }
    return apiResponse(res, 200, true, 'Roadmap generated', milestones);
  } catch (err) {
    console.error("Groq Error (Roadmap):", err);
    // Fallback if JSON parsing fails
    const fallback = [
      { title: "Foundations", status: "done", desc: "Master fundamentals." },
      { title: "Skill Building", status: "current", desc: "Grow missing skills based on your profile." },
      { title: "Projects", status: "upcoming", desc: "Apply skills in real world." },
      { title: "Interviews", status: "upcoming", desc: "Prepare for mock interviews." },
      { title: "Job Offer", status: "upcoming", desc: "Land your target role." }
    ];
    return apiResponse(res, 200, true, 'Roadmap generated', fallback);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  chatWithAgent,
  simulateReadiness,
  generateRoadmap,
};
