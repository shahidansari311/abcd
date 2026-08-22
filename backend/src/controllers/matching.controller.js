const matchingService = require('../services/matching.service');
const apiResponse = require('../utils/apiResponse');

const getMyMatches = async (req, res) => {
  const matches = await matchingService.getMatchesForStudent(req.user.id);
  return apiResponse(res, 200, true, 'Matches generated successfully', matches);
};

module.exports = {
  getMyMatches,
};
