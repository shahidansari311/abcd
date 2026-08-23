const studentService = require('../services/student.service');
const apiResponse = require('../utils/apiResponse');
const { getGroqChatCompletion } = require('../ai/llmClient');
const SkillProfile = require('../models/SkillProfile.model');
const Opportunity = require('../models/Opportunity.model');

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
Generate a JSON object with a single key "roadmap" containing an array of exact 5 career milestones for them to reach a Data Scientist or related role.
Their current skills: ${skillsContext}.
Return ONLY a valid JSON object with the exact structure:
{
  "roadmap": [
    { "title": "Milestone Name", "status": "done" | "current" | "upcoming", "desc": "Brief 1-sentence description" }
  ]
}
At least one milestone should be "current". Prioritize what they are lacking.`;

  try {
    const aiResponse = await getGroqChatCompletion(
      [{ role: 'system', content: systemPrompt }], 
      { response_format: { type: 'json_object' } }
    );
    const replyText = aiResponse.choices[0]?.message?.content || '{"roadmap": []}';
    const parsedData = JSON.parse(replyText);
    const milestones = parsedData.roadmap || [];
    
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

const getSkillGap = async (req, res) => {
  const studentId = req.user.id;
  const skillProfile = await SkillProfile.findOne({ student: studentId }).lean();
  const opportunities = await Opportunity.find({ isActive: true }).lean();

  const industryDemand = {};
  opportunities.forEach(opp => {
    opp.requiredSkills.forEach(reqSkill => {
      if (!industryDemand[reqSkill.skillName]) {
        industryDemand[reqSkill.skillName] = { maxRequired: 0, count: 0 };
      }
      if (reqSkill.minimumScore > industryDemand[reqSkill.skillName].maxRequired) {
        industryDemand[reqSkill.skillName].maxRequired = reqSkill.minimumScore;
      }
      industryDemand[reqSkill.skillName].count += 1;
    });
  });

  const studentSkills = {};
  if (skillProfile && skillProfile.skills) {
    skillProfile.skills.forEach(s => {
      studentSkills[s.name] = s.score;
    });
  }

  const analysis = [];
  let overallGap = 0;
  let gapCount = 0;

  for (const skillName in industryDemand) {
    const required = industryDemand[skillName].maxRequired;
    const current = studentSkills[skillName] || 0;
    
    analysis.push({
      skill: skillName,
      current,
      required,
      gap: Math.max(0, required - current)
    });

    if (required > current) {
      overallGap += (required - current);
      gapCount += 1;
    }
  }

  // Sort by gap size
  analysis.sort((a, b) => b.gap - a.gap);
  
  // Format the radar data for the frontend
  const radarData = analysis.slice(0, 6).map(item => ({
    subject: item.skill,
    A: item.current,
    B: item.required,
    fullMark: 100
  }));

  // Find top missing skills
  const targetRole = opportunities.length > 0 ? opportunities[0].title : "Data Scientist";

  return apiResponse(res, 200, true, 'Skill gap fetched', {
    targetRole,
    radarData: radarData.length > 0 ? radarData : [
      { subject: "Python", A: 0, B: 80, fullMark: 100 },
      { subject: "SQL", A: 0, B: 75, fullMark: 100 }
    ],
    detailedAnalysis: analysis.length > 0 ? analysis : [
      { skill: "Python", current: 0, required: 80, gap: 80 }
    ]
  });
};

const getPassport = async (req, res) => {
  const studentId = req.user.id;
  const skillProfile = await SkillProfile.findOne({ student: studentId }).lean();
  
  const verifications = [];
  if (skillProfile && skillProfile.skills) {
    skillProfile.skills.filter(s => s.isVerified).forEach(s => {
      verifications.push({
        id: s._id || Math.random().toString(),
        skill: s.name,
        issuer: "Industry Partner",
        date: s.updatedAt || new Date(),
        type: "Assessment",
        score: s.score
      });
    });
  }

  return apiResponse(res, 200, true, 'Passport fetched', {
    address: "0x" + studentId.substring(0, 10).padEnd(40, '0'), // Mock crypto address based on ID
    verifications: verifications.length > 0 ? verifications : [
      { id: "1", skill: "Platform Onboarding", issuer: "SkillBridge", date: new Date(), type: "System", score: 100 }
    ]
  });
};

module.exports = {
  getProfile,
  updateProfile,
  chatWithAgent,
  simulateReadiness,
  generateRoadmap,
  getSkillGap,
  getPassport,
};
