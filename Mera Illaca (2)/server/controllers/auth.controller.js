const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, neighborhood } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.'
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: role || 'resident',
      neighborhood
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Mera Ilaka.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        neighborhood: user.neighborhood
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Include password field explicitly (it's select:false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check account lock
    if (user.isLocked()) {
      const unlockTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked. Try again in ${unlockTime} minute(s).`
      });
    }

    // Check active status
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment failed attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 min
        user.loginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        neighborhood: user.neighborhood,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── VERIFY TOKEN ─────────────────────────────────────────────────────────────
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        neighborhood: user.neighborhood
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── FORGOT PASSWORD (stub) ───────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent user enumeration
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
