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

module.exports = {
  getProfile,
  getGapAnalysis,
  getRoadmap,
};
