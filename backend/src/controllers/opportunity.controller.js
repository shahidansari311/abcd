const opportunityService = require('../services/opportunity.service');
const apiResponse = require('../utils/apiResponse');

const createOpportunity = async (req, res) => {
  const opportunity = await opportunityService.createOpportunity(req.user.id, req.body);
  return apiResponse(res, 201, true, 'Opportunity created successfully', opportunity);
};

const getMyOpportunities = async (req, res) => {
  const opportunities = await opportunityService.getOpportunitiesForIndustry(req.user.id);
  return apiResponse(res, 200, true, 'Opportunities fetched successfully', opportunities);
};

const getAllOpportunities = async (req, res) => {
  const opportunities = await opportunityService.getAllOpportunities();
  return apiResponse(res, 200, true, 'Opportunities fetched successfully', opportunities);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['Open', 'Paused', 'Closed'].includes(status)) {
    return apiResponse(res, 400, false, 'Invalid status');
  }

  const opportunity = await opportunityService.updateOpportunityStatus(id, req.user.id, status);
  if (!opportunity) {
    return apiResponse(res, 404, false, 'Opportunity not found or you do not have permission');
  }

  return apiResponse(res, 200, true, 'Status updated successfully', opportunity);
};

module.exports = {
  createOpportunity,
  getMyOpportunities,
  getAllOpportunities,
  updateStatus,
};
