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

module.exports = {
  createOpportunity,
  getMyOpportunities,
};
