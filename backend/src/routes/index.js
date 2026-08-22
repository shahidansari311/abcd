const express = require('express');
const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const industryRoutes = require('./industry.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/industry', industryRoutes);

module.exports = router;
