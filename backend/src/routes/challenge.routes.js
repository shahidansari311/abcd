const router = require('express').Router();
const challengeController = require('../controllers/challenge.controller');
const auth = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(auth);

router.get('/', asyncHandler(challengeController.getChallenges));
router.post('/:id/join', asyncHandler(challengeController.joinChallenge));

module.exports = router;
