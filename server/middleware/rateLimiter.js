const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again in 15 minutes'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased for development/troubleshooting
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many accounts created from this IP, please try again in an hour'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, registerLimiter, generalLimiter };

