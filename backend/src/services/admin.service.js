const User = require('../models/User.model');
const Opportunity = require('../models/Opportunity.model');
const ProjectWorkspace = require('../models/ProjectWorkspace.model');
const VerificationRequest = require('../models/VerificationRequest.model');

const getPlatformStats = async () => {
  const [
    totalUsers,
    activeOpportunities,
    activeWorkspaces,
    pendingVerifications
  ] = await Promise.all([
    User.countDocuments(),
    Opportunity.countDocuments({ isActive: true }),
    ProjectWorkspace.countDocuments({ isActive: true }),
    VerificationRequest.countDocuments({ status: 'pending' })
  ]);

  return {
    totalUsers,
    activeOpportunities,
    activeWorkspaces,
    pendingVerifications
  };
};

module.exports = {
  getPlatformStats
};
