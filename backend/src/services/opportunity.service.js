const Opportunity = require('../models/Opportunity.model');
const embeddingClient = require('../ai/embeddingClient');

const createOpportunity = async (industryPartnerId, data) => {
  // Generate embedding for the job description to be used in semantic matching
  const embedding = await embeddingClient.generateEmbedding(`${data.title} ${data.description}`);
  
  const opportunity = await Opportunity.create({
    ...data,
    industryPartner: industryPartnerId,
    embedding
  });

  return opportunity;
};

const getOpportunitiesForIndustry = async (industryPartnerId) => {
  return Opportunity.find({ industryPartner: industryPartnerId }).sort({ createdAt: -1 });
};

const getAllOpportunities = async () => {
  return Opportunity.find({ status: 'open' }).populate('industryPartner', 'companyName').sort({ createdAt: -1 });
};

module.exports = {
  createOpportunity,
  getOpportunitiesForIndustry,
  getAllOpportunities,
};
