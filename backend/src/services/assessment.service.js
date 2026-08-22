const Assessment = require('../models/Assessment.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const ApiError = require('../utils/apiError');

const getAvailableAssessments = async () => {
  return Assessment.find({ isActive: true }).select('-questions.correctAnswer');
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

  return result;
};

module.exports = {
  getAvailableAssessments,
  getAssessmentById,
  submitAssessment,
};
