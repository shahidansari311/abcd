const express = require('express');
const verificationController = require('../controllers/verification.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);

// Student routes
router.post('/request', rbac('student'), asyncHandler(verificationController.createRequest));

// Academician and Industry routes
router.get('/pending', rbac('academician', 'industry'), asyncHandler(verificationController.getPendingRequests));
router.put('/:id/process', rbac('academician', 'industry'), asyncHandler(verificationController.processRequest));

module.exports = router;
