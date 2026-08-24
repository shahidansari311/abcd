const Assessment = require('../models/Assessment.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const SkillProfile = require('../models/SkillProfile.model');
const Student = require('../models/Student.model');
const ApiError = require('../utils/apiError');
const momentumService = require('./momentum.service');

const getAvailableAssessments = async (studentId) => {
  if (studentId) {
    const student = await Student.findById(studentId);
    if (student && student.careerRoadmap && student.careerRoadmap.length > 0) {
      const targetRole = student.targetRole || 'Data Scientist';
      const roleAssessments = await Assessment.find({ isActive: true, targetRole }).select('-questions.correctAnswer');
      if (roleAssessments.length > 0) {
        return { context: 'roadmap', targetRole, assessments: roleAssessments };
      }
    }
  }

  const demoAssessments = await Assessment.find({ isActive: true, targetRole: 'demo' }).select('-questions.correctAnswer');
  
  if (demoAssessments.length === 0) {
    const all = await Assessment.find({ isActive: true }).select('-questions.correctAnswer');
    return { context: 'demo', assessments: all };
  }
  
  return { context: 'demo', assessments: demoAssessments };
};

const getAssessmentById = async (id) => {
  const assessment = await Assessment.findById(id).select('-questions.correctAnswer');
  if (!assessment) throw new ApiError(404, 'Assessment not found');
  return assessment;
};

const submitAssessment = async (studentId, assessmentId, answers) => {
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) throw new ApiError(404, 'Assessment not found');

  let score = 0;
  const processedAnswers = answers.map(ans => {
    const question = assessment.questions.id(ans.questionId);
    const isCorrect = question && question.correctAnswer === ans.providedAnswer;
    if (isCorrect) score += question.points;
    return {
      questionId: ans.questionId,
      providedAnswer: ans.providedAnswer,
      isCorrect,
    };
  });

  const maxScore = assessment.questions.reduce((sum, q) => sum + q.points, 0);
  const percentage = (score / maxScore) * 100;

  const result = await AssessmentResult.create({
    student: studentId,
    assessment: assessmentId,
    score,
    maxScore,
    percentage,
    answers: processedAnswers,
  });

  // Update Skill Profile
  let skillProfile = await SkillProfile.findOne({ student: studentId });
  if (!skillProfile) {
    skillProfile = new SkillProfile({ student: studentId, skills: [] });
  }

  const skillName = assessment.relatedSkill || assessment.title.replace(' Assessment', '').trim();
  const existingSkillIndex = skillProfile.skills.findIndex(s => s.name === skillName);
  
  const skillData = {
    name: skillName,
    score: percentage,
    confidence: percentage > 70 ? 0.9 : 0.5,
    isVerified: percentage > 70,
    evidence: [{
      type: 'assessment',
      refId: result._id,
      dateAdded: new Date()
    }]
  };

  if (existingSkillIndex > -1) {
    skillProfile.skills[existingSkillIndex] = skillData;
  } else {
    skillProfile.skills.push(skillData);
  }

  skillProfile.lastRecomputedAt = new Date();
  await skillProfile.save();

  // Add Momentum Points (e.g., 20 points per assessment, bonus for passing)
  const momentumPoints = percentage > 70 ? 30 : 15;
  await momentumService.addMomentum(studentId, momentumPoints);

  return result;
};

module.exports = {
  getAvailableAssessments,
  getAssessmentById,
  submitAssessment,
};
