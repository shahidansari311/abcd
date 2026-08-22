const express = require('express');
const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const industryRoutes = require('./industry.routes');
const assessmentRoutes = require('./assessment.routes');
const skillRoutes = require('./skill.routes');
const opportunityRoutes = require('./opportunity.routes');
const matchingRoutes = require('./matching.routes');
const verificationRoutes = require('./verification.routes');
const messagingRoutes = require('./messaging.routes');
const workspaceRoutes = require('./workspace.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/industry', industryRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/skill', skillRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/matching', matchingRoutes);
router.use('/verification', verificationRoutes);
router.use('/messages', messagingRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
