const verificationService = require('../services/verification.service');
const apiResponse = require('../utils/apiResponse');

const createRequest = async (req, res) => {
  const request = await verificationService.createVerificationRequest(req.user.id, req.body);
  return apiResponse(res, 201, true, 'Verification request submitted', request);
};

const getPendingRequests = async (req, res) => {
  let requests;
  if (req.user.role === 'industry') {
    requests = await verificationService.getPendingRequestsForIndustry(req.user.id);
  } else {
    requests = await verificationService.getPendingRequestsForAcademician(req.user.id);
  }
  return apiResponse(res, 200, true, 'Pending requests fetched', requests);
};

const processRequest = async (req, res) => {
  const { status, notes } = req.body;
  const request = await verificationService.processVerification(req.params.id, req.user.id, status, notes);
  return apiResponse(res, 200, true, `Request ${status} successfully`, request);
};

module.exports = {
  createRequest,
  getPendingRequests,
  processRequest,
};
