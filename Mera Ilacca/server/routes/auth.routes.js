const express = require('express');
const router = express.Router();

const {
  register,
  login,
  verifyToken,
  forgotPassword
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', registerLimiter, register);

// POST /api/auth/login
router.post('/login', loginLimiter, login);

// GET  /api/auth/me  (protected)
router.get('/me', protect, verifyToken);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

module.exports = router;
