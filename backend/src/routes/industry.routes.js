const express = require('express');
const industryController = require('../controllers/industry.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth); // Require authentication for all industry routes
router.use(rbac('industry')); // Require industry role

router.route('/profile')
  .get(asyncHandler(industryController.getProfile))
  .put(asyncHandler(industryController.updateProfile));

router.get('/dashboard', asyncHandler(industryController.getDashboardStats));
router.get('/pipeline', asyncHandler(industryController.getPipeline));
router.put('/pipeline/:id/status', asyncHandler(industryController.updatePipelineStatus));
router.get('/candidates', asyncHandler(industryController.searchCandidates));
router.get('/candidates/:id', asyncHandler(industryController.getCandidateById));
router.get('/analytics', asyncHandler(industryController.getAnalytics));

module.exports = router;

