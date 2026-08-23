const express = require('express');
const opportunityController = require('../controllers/opportunity.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);

// All authenticated users can see all open opportunities
router.get('/all', asyncHandler(opportunityController.getAllOpportunities));

// Only industry can create, manage, and view their own
router.post('/', rbac('industry'), asyncHandler(opportunityController.createOpportunity));
router.get('/', rbac('industry'), asyncHandler(opportunityController.getMyOpportunities));
router.patch('/:id/status', rbac('industry'), asyncHandler(opportunityController.updateStatus));

module.exports = router;
