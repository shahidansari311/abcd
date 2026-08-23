const express = require('express');
const studentController = require('../controllers/student.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.use(auth); // Require authentication for all student routes
router.use(rbac('student')); // Require student role

const opportunityController = require('../controllers/opportunity.controller');

router.route('/profile')
  .get(asyncHandler(studentController.getProfile))
  .put(asyncHandler(studentController.updateProfile));

router.post('/career-agent/chat', asyncHandler(studentController.chatWithAgent));
const resumeController = require('../controllers/resume.controller');
const interviewController = require('../controllers/interview.controller');

router.post('/simulate-readiness', asyncHandler(studentController.simulateReadiness));
router.get('/roadmap', asyncHandler(studentController.generateRoadmap));
router.post('/resume-analyze', upload.single('resume'), asyncHandler(resumeController.analyzeResume));
router.post('/mock-interview/chat', asyncHandler(interviewController.mockInterviewChat));

router.get('/opportunities', asyncHandler(opportunityController.getAllOpportunities));

module.exports = router;
