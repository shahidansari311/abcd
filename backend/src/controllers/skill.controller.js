const skillProfileService = require('../services/skillProfile.service');
const skillGapService = require('../services/skillGap.service');
const careerRoadmapService = require('../services/careerRoadmap.service');
const apiResponse = require('../utils/apiResponse');

const getProfile = async (req, res) => {
  const profile = await skillProfileService.getProfileForStudent(req.user.id);
  return apiResponse(res, 200, true, 'Skill profile fetched successfully', profile);
};

const getGapAnalysis = async (req, res) => {
  const { targetRole } = req.query;
  const profile = await skillProfileService.getProfileForStudent(req.user.id);
  const gaps = await skillGapService.getGapAnalysis(profile, targetRole);
  return apiResponse(res, 200, true, 'Gap analysis completed', gaps);
};

const getRoadmap = async (req, res) => {
  const { targetRole } = req.body; // or fetch previous gaps from DB
  const profile = await skillProfileService.getProfileForStudent(req.user.id);
  const gaps = await skillGapService.getGapAnalysis(profile, targetRole);
  
  const roadmap = await careerRoadmapService.generateRoadmap(gaps, targetRole);
  return apiResponse(res, 200, true, 'Roadmap generated successfully', roadmap);
};

const SkillProfile = require('../models/SkillProfile.model');

const getLeaderboard = async (req, res) => {
  const { skill } = req.query;
  
  if (!skill) {
    return apiResponse(res, 400, false, 'Skill parameter is required');
  }

  // Find all profiles that have the requested skill
  const profiles = await SkillProfile.find({ 'skills.name': new RegExp(`^${skill}$`, 'i') })
    .populate('student', 'firstName lastName institution')
    .lean();

  // Extract the specific skill and sort
  const leaderboard = profiles.map(p => {
    const matchedSkill = p.skills.find(s => s.name.toLowerCase() === skill.toLowerCase());
    return {
      student: p.student,
      score: matchedSkill ? matchedSkill.score : 0,
      confidence: matchedSkill ? matchedSkill.confidence : 0,
      isVerified: matchedSkill ? matchedSkill.isVerified : false,
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 100); // Top 100

  return apiResponse(res, 200, true, `Leaderboard for ${skill}`, leaderboard);
};

module.exports = {
  getProfile,
  getGapAnalysis,
  getRoadmap,
  getLeaderboard,
};
