const express = require('express');
const studentController = require('../controllers/student.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth); // Require authentication for all student routes
router.use(rbac('student')); // Require student role

const opportunityController = require('../controllers/opportunity.controller');

router.route('/profile')
  .get(asyncHandler(studentController.getProfile))
  .put(asyncHandler(studentController.updateProfile));

router.get('/opportunities', asyncHandler(opportunityController.getAllOpportunities));

module.exports = router;
