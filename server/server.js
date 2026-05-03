import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import cryptoRoutes from './routes/crypto.js';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.set('trust proxy', 1); // Trust Render's proxy for secure cookies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
);

// 404 handler
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

// ─── Database + Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Mask password for logging: replace everything between the first : after // and the next @
const maskedURI = process.env.MONGO_URI?.replace(/(\/\/.*:).+(@.*)/, '$1****$2');
console.log(`📡 Attempting to connect to: ${maskedURI}`);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
