const industryService = require('../services/industry.service');
const apiResponse = require('../utils/apiResponse');

const getProfile = async (req, res) => {
  const industry = await industryService.getProfile(req.user.id);
  return apiResponse(res, 200, true, 'Profile fetched successfully', { industry });
};

const updateProfile = async (req, res) => {
  const industry = await industryService.updateProfile(req.user.id, req.body);
  return apiResponse(res, 200, true, 'Profile updated successfully', { industry });
};

module.exports = {
  getProfile,
  updateProfile,
};
