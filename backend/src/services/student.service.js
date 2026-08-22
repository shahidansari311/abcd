const Student = require('../models/Student.model');
const ApiError = require('../utils/apiError');

const getProfile = async (userId) => {
  const student = await Student.findById(userId).select('-passwordHash');
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }
  return student;
};

const updateProfile = async (userId, updateData) => {
  const student = await Student.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-passwordHash');
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }
  return student;
};

module.exports = {
  getProfile,
  updateProfile,
};
