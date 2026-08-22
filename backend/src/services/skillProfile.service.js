const SkillProfile = require('../models/SkillProfile.model');

const getProfileForStudent = async (studentId) => {
  let profile = await SkillProfile.findOne({ student: studentId });
  if (!profile) {
    // Return empty profile or create a default one
    profile = await SkillProfile.create({ student: studentId, skills: [] });
  }
  return profile;
};

// Simplified recomputation for MVP
const recomputeProfile = async (studentId) => {
  // In a full implementation, this would aggregate from AssessmentResult, Projects, etc.
  // Here we just return the existing or create an empty one.
  return getProfileForStudent(studentId);
};

module.exports = {
  getProfileForStudent,
  recomputeProfile,
};
