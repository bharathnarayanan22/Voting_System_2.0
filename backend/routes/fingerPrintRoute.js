const express = require('express');
const { registerChallenge, registerVerify, registerUser, loginChallenge, loginVerify } = require('../controllers/fingerPrintController');

const router = express.Router();

router.post('/register-user', registerUser);
router.post('/register-challenge', registerChallenge);
router.post('/register', registerVerify);
router.post('/loginChallenge', loginChallenge);
router.post('/loginVerify', loginVerify);

module.exports = router;
