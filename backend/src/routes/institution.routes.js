const express = require('express');
const institutionController = require('../controllers/institution.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
router.use(rbac('institution')); // Only institution role can access these routes

router.route('/profile')
  .get(asyncHandler(institutionController.getProfile))
  .put(asyncHandler(institutionController.updateProfile));

router.get('/skill-gaps', asyncHandler(institutionController.getSkillGaps));
router.post('/interventions', asyncHandler(institutionController.recordIntervention));
router.get('/stats', asyncHandler(institutionController.getDashboardStats));
router.get('/students', asyncHandler(institutionController.getStudents));
router.get('/heatmap', asyncHandler(institutionController.getHeatmap));
router.get('/partners', asyncHandler(institutionController.getPartners));
router.get('/partners/:id', asyncHandler(institutionController.getPartnerById));
router.get('/placements', asyncHandler(institutionController.getPlacementAnalytics));

module.exports = router;
