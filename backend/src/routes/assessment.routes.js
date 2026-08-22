const express = require('express');
const assessmentController = require('../controllers/assessment.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
router.use(rbac('student'));

router.get('/', asyncHandler(assessmentController.getAvailableAssessments));
router.get('/:id', asyncHandler(assessmentController.getAssessmentById));
router.post('/:id/submit', asyncHandler(assessmentController.submitAssessment));

module.exports = router;
