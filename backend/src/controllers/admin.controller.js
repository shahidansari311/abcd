const adminService = require('../services/admin.service');
const apiResponse = require('../utils/apiResponse');

const getDashboardStats = async (req, res) => {
  const stats = await adminService.getPlatformStats();
  return apiResponse(res, 200, true, 'Platform stats fetched successfully', stats);
};

module.exports = {
  getDashboardStats
};
