const rateLimit = require('express-rate-limit');

/**
 * Limit login attempts: max 10 per 15 minutes per IP.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Limit register attempts: max 5 per hour per IP.
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter, registerLimiter };
