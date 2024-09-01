const express = require('express');
const { register, registerComplete, authenticate, authenticateComplete } = require('../controllers/fingerPrintController');

const router = express.Router();

// router.post('/register-user', registerUser);
// router.post('/register-challenge', registerChallenge);
// router.post('/register', registerVerify);
// router.post('/loginChallenge', loginChallenge);
// router.post('/loginVerify', loginVerify);

router.post('/register', register);
router.post('/register/complete', registerComplete);
router.post('/authenticate', authenticate);
router.post('/authenticate/complete', authenticateComplete);

module.exports = router;
