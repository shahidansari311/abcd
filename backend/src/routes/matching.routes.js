const express = require('express');
const matchingController = require('../controllers/matching.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
router.use(rbac('student'));

router.get('/', asyncHandler(matchingController.getMyMatches));

module.exports = router;
