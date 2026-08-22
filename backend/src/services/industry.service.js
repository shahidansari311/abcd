const Industry = require('../models/Industry.model');
const ApiError = require('../utils/apiError');

const getProfile = async (userId) => {
  const industry = await Industry.findById(userId).select('-passwordHash');
  if (!industry) {
    throw new ApiError(404, 'Industry profile not found');
  }
  return industry;
};

const updateProfile = async (userId, updateData) => {
  const industry = await Industry.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-passwordHash');
  if (!industry) {
    throw new ApiError(404, 'Industry profile not found');
  }
  return industry;
};

module.exports = {
  getProfile,
  updateProfile,
};
