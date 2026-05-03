import express from 'express';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/profile  — protected
router.get('/profile', protect, getProfile);

export default router;
