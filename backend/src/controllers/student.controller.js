const studentService = require('../services/student.service');
const apiResponse = require('../utils/apiResponse');

const getProfile = async (req, res) => {
  const student = await studentService.getProfile(req.user.id);
  return apiResponse(res, 200, true, 'Profile fetched successfully', { student });
};

const updateProfile = async (req, res) => {
  const student = await studentService.updateProfile(req.user.id, req.body);
  return apiResponse(res, 200, true, 'Profile updated successfully', { student });
};

module.exports = {
  getProfile,
  updateProfile,
};
