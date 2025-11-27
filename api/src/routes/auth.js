const express = require('express');
const router = express.Router();
const { registro, login, testMethod } = require('../controllers/authController.js');

router.post('/register', registro);
router.post('/login', login);

module.exports = router;