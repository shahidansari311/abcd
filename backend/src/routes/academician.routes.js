const express = require('express');
const academicianController = require('../controllers/academician.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
router.use(rbac('academician'));

router.get('/dashboard', asyncHandler(academicianController.getDashboardStats));

module.exports = router;
