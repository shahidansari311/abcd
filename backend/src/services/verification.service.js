const VerificationRequest = require('../models/VerificationRequest.model');
const SkillProfile = require('../models/SkillProfile.model');
const ApiError = require('../utils/apiError');

const createVerificationRequest = async (studentId, data) => {
  const request = await VerificationRequest.create({
    student: studentId,
    ...data,
  });
  return request;
};

const getPendingRequestsForAcademician = async (academicianId) => {
  return VerificationRequest.find({ academician: academicianId, status: 'pending' })
    .populate('student', 'email firstName lastName')
    .sort({ createdAt: -1 });
};

const getPendingRequestsForIndustry = async (industryId) => {
  return VerificationRequest.find({ industry: industryId, status: 'pending' })
    .populate('student', 'email firstName lastName')
    .sort({ createdAt: -1 });
};

const processVerification = async (requestId, reviewerId, status, notes) => {
  const request = await VerificationRequest.findOne({ 
    _id: requestId, 
    $or: [{ academician: reviewerId }, { industry: reviewerId }]
  });
  if (!request) {
    throw new ApiError(404, 'Verification request not found or not assigned to you');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'Request has already been processed');
  }

  request.status = status;
  request.reviewerNotes = notes;
  request.reviewedAt = Date.now();
  await request.save();

  // If approved, update the student's skill profile confidence
  if (status === 'approved') {
    const profile = await SkillProfile.findOne({ student: request.student });
    if (profile) {
      const skill = profile.skills.id(request.skillRef);
      if (skill) {
        skill.isVerified = true;
        // Boost confidence by 0.2, capped at 1.0
        skill.confidence = Math.min(1.0, skill.confidence + 0.2);
        await profile.save();
      }
    }
  }

  return request;
};

module.exports = {
  createVerificationRequest,
  getPendingRequestsForAcademician,
  getPendingRequestsForIndustry,
  processVerification,
};
