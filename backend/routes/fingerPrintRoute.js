const express = require('express');
const { registerChallenge, registerVerify, registerUser } = require('../controllers/fingerPrintController');

const router = express.Router();

router.post('/register-user', registerUser);
router.post('/register-challenge', registerChallenge);
router.post('/register', registerVerify);

module.exports = router;
