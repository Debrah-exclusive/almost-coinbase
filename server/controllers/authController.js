import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate a signed JWT token for a user ID
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

/**
 * Set the JWT as an HTTP-only cookie and return JSON response
 */
const sendTokenResponse = (res, statusCode, user, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

// ─── POST /api/auth/register ────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists',
      });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(res, 201, user, 'Account created successfully');
  } catch (err) {
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    console.error('[register]', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Explicitly select password field (excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    sendTokenResponse(res, 200, user, 'Logged in successfully');
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
export const logout = (_req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out successfully' });
};

// ─── GET /api/auth/profile ───────────────────────────────────────────────────
// Protected — requires valid JWT (handled by protect middleware)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('[getProfile]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
