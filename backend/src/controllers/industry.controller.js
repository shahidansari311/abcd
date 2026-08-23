const industryService = require('../services/industry.service');
const apiResponse = require('../utils/apiResponse');

const Opportunity = require('../models/Opportunity.model');
const Application = require('../models/Application.model');
const SkillProfile = require('../models/SkillProfile.model');

const getProfile = async (req, res) => {
  const industry = await industryService.getProfile(req.user.id);
  return apiResponse(res, 200, true, 'Profile fetched successfully', { industry });
};

const updateProfile = async (req, res) => {
  const industry = await industryService.updateProfile(req.user.id, req.body);
  return apiResponse(res, 200, true, 'Profile updated successfully', { industry });
};

const getDashboardStats = async (req, res) => {
  const activePostings = await Opportunity.countDocuments({ industryPartner: req.user.id, status: 'Open' });
  
  // Get all opportunity IDs for this industry
  const opportunities = await Opportunity.find({ industryPartner: req.user.id }).select('_id');
  const opportunityIds = opportunities.map(o => o._id);

  const pipelineCount = await Application.countDocuments({ opportunity: { $in: opportunityIds } });
  
  const interviewsCount = await Application.countDocuments({ 
    opportunity: { $in: opportunityIds },
    status: 'Interview' 
  });
  
  const hiresCount = await Application.countDocuments({ 
    opportunity: { $in: opportunityIds },
    status: 'Hired' 
  });

  return apiResponse(res, 200, true, 'Dashboard stats fetched', {
    activePostings,
    pipelineCount,
    interviewsCount,
    hiresCount,
    applicationsTrend: [12, 18, 15, 24, 30, 28, 41, 38, 52, 47, 61, 58], // Mock trend data
  });
};

const getPipeline = async (req, res) => {
  const opportunities = await Opportunity.find({ industryPartner: req.user.id }).select('_id');
  const opportunityIds = opportunities.map(o => o._id);

  const applications = await Application.find({ opportunity: { $in: opportunityIds } })
    .populate('student', 'firstName lastName')
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, true, 'Pipeline fetched', applications);
};

const updatePipelineStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Ensure the application belongs to an opportunity owned by this industry
  const application = await Application.findById(id).populate('opportunity');
  if (!application || application.opportunity.industryPartner.toString() !== req.user.id.toString()) {
    return apiResponse(res, 404, false, 'Application not found or unauthorized');
  }

  application.status = status;
  await application.save();
  return apiResponse(res, 200, true, 'Status updated', application);
};

const searchCandidates = async (req, res) => {
  const skillProfiles = await SkillProfile.find()
    .populate('student', 'firstName lastName')
    .limit(20);

  return apiResponse(res, 200, true, 'Candidates fetched', skillProfiles);
};

const getCandidateById = async (req, res) => {
  const { id } = req.params;
  const profile = await SkillProfile.findOne({ student: id }).populate('student', 'firstName lastName email major graduationYear bio');
  if (!profile) {
    return apiResponse(res, 404, false, 'Candidate profile not found');
  }
  return apiResponse(res, 200, true, 'Candidate fetched', profile);
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getPipeline,
  updatePipelineStatus,
  searchCandidates,
  getCandidateById
};
