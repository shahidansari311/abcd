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

  // Aggregation for scalable leaderboard
  const leaderboard = await SkillProfile.aggregate([
    { $unwind: "$skills" },
    { $match: { "skills.name": new RegExp(`^${skill}$`, 'i') } },
    { $sort: { "skills.score": -1 } },
    { $limit: 100 },
    {
      $lookup: {
        from: "users",
        localField: "student",
        foreignField: "_id",
        as: "studentInfo"
      }
    },
    { $unwind: "$studentInfo" },
    {
      $project: {
        _id: 0,
        student: {
          _id: "$studentInfo._id",
          firstName: "$studentInfo.firstName",
          lastName: "$studentInfo.lastName",
          institution: "$studentInfo.institution"
        },
        score: "$skills.score",
        confidence: "$skills.confidence",
        isVerified: "$skills.isVerified"
      }
    }
  ]);

  return apiResponse(res, 200, true, `Leaderboard for ${skill}`, leaderboard);
};

module.exports = {
  getProfile,
  getGapAnalysis,
  getRoadmap,
  getLeaderboard,
};
