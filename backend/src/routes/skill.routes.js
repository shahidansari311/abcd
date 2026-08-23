const express = require('express');
const skillController = require('../controllers/skill.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
router.use(rbac('student')); // Primarily student facing for now

router.get('/profile', asyncHandler(skillController.getProfile));
router.get('/gaps', asyncHandler(skillController.getGapAnalysis));
router.post('/roadmap', asyncHandler(skillController.getRoadmap));
router.get('/leaderboard', asyncHandler(skillController.getLeaderboard));

module.exports = router;
