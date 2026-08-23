const ProjectWorkspace = require('../models/ProjectWorkspace.model');
const apiResponse = require('../utils/apiResponse');

const getDashboardStats = async (req, res) => {
  // We'll fetch real count of active collaborations.
  // We'll use mock data for publications, students, and grants as agreed.
  
  const activeCollaborations = await ProjectWorkspace.countDocuments({
    members: req.user.id,
    isActive: true
  });

  const stats = {
    activeCollaborations,
    publications: 132,
    studentsMentored: 41,
    grantFunding: 2.4, // Millions
    researchImpact: [820, 910, 880, 1040, 1120, 1090, 1210, 1330, 1290, 1420, 1560, 1680]
  };

  return apiResponse(res, 200, true, 'Academician stats fetched successfully', stats);
};

module.exports = {
  getDashboardStats
};
