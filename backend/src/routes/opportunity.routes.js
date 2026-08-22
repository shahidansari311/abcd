const express = require('express');
const opportunityController = require('../controllers/opportunity.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
router.use(rbac('industry'));

router.post('/', asyncHandler(opportunityController.createOpportunity));
router.get('/', asyncHandler(opportunityController.getMyOpportunities));

module.exports = router;
