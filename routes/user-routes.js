const express = require('express');
const router = express.Router();
const userControllers = require('../user');
const { verifyToken } = require('../middleware/auth');

router.post('/api/register', userControllers.registerUser);
router.post('/api/login', userControllers.loginUser);


module.exports = router;