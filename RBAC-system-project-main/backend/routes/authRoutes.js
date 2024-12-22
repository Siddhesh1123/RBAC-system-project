const express = require('express');
const { loginUser, createUser } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/signup - User signup
router.post('/signup', createUser);

// POST /api/auth/login - User login
router.post('/login', loginUser);

module.exports = router;
