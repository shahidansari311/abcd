const assessmentService = require('../services/assessment.service');
const apiResponse = require('../utils/apiResponse');

const getAvailableAssessments = async (req, res) => {
  const assessments = await assessmentService.getAvailableAssessments();
  return apiResponse(res, 200, true, 'Assessments fetched successfully', assessments);
};

const getAssessmentById = async (req, res) => {
  const assessment = await assessmentService.getAssessmentById(req.params.id);
  return apiResponse(res, 200, true, 'Assessment fetched successfully', assessment);
};

const submitAssessment = async (req, res) => {
  const result = await assessmentService.submitAssessment(req.user.id, req.params.id, req.body.answers);
  return apiResponse(res, 201, true, 'Assessment submitted successfully', result);
};

module.exports = {
  getAvailableAssessments,
  getAssessmentById,
  submitAssessment,
};
