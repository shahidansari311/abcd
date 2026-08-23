const Application = require('../models/Application.model');
const apiResponse = require('../utils/apiResponse');

const getApplications = async (req, res) => {
  const applications = await Application.find({ student: req.user.id }).sort({ createdAt: -1 });
  return apiResponse(res, 200, true, 'Applications fetched', applications);
};

const createApplication = async (req, res) => {
  const { company, role, status } = req.body;
  const application = await Application.create({
    student: req.user.id,
    company,
    role,
    status
  });
  return apiResponse(res, 201, true, 'Application created', application);
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const application = await Application.findOneAndUpdate(
    { _id: id, student: req.user.id },
    { status },
    { new: true }
  );
  if (!application) {
    return apiResponse(res, 404, false, 'Application not found');
  }
  return apiResponse(res, 200, true, 'Application updated', application);
};

module.exports = { getApplications, createApplication, updateApplicationStatus };
