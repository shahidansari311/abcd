const express = require('express');
const institutionController = require('../controllers/institution.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
// In a real application, restrict this to 'institution_admin' role.
// For testing the UI easily without multiple logins, we'll allow access.
// router.use(rbac('institution_admin')); 

router.get('/skill-gaps', asyncHandler(institutionController.getSkillGaps));
router.post('/interventions', asyncHandler(institutionController.recordIntervention));
router.get('/stats', asyncHandler(institutionController.getDashboardStats));
router.get('/students', asyncHandler(institutionController.getStudents));
router.get('/heatmap', asyncHandler(institutionController.getHeatmap));
router.get('/partners', asyncHandler(institutionController.getPartners));
router.get('/placements', asyncHandler(institutionController.getPlacementAnalytics));

module.exports = router;
