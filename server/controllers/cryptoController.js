import Crypto from '../models/Crypto.js';

// ─── GET /api/crypto ─────────────────────────────────────────────────────────
// Returns all cryptocurrencies
export const getAllCrypto = async (_req, res) => {
  try {
    const coins = await Crypto.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coins.length, data: coins });
  } catch (err) {
    console.error('[getAllCrypto]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /api/crypto/gainers ─────────────────────────────────────────────────
// Top gainers: sorted by change24h descending (highest % gain first)
export const getTopGainers = async (_req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({ change24h: -1 });
    res.json({ success: true, count: gainers.length, data: gainers });
  } catch (err) {
    console.error('[getTopGainers]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET /api/crypto/new ─────────────────────────────────────────────────────
// New listings: sorted by createdAt descending (newest first)
export const getNewListings = async (_req, res) => {
  try {
    const newCoins = await Crypto.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: newCoins.length, data: newCoins });
  } catch (err) {
    console.error('[getNewListings]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── POST /api/crypto ────────────────────────────────────────────────────────
// Add a new cryptocurrency
export const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price == null) {
      return res.status(400).json({
        success: false,
        message: 'name, symbol, and price are required',
      });
    }

    const coin = await Crypto.create({ name, symbol, price, image, change24h });
    res.status(201).json({
      success: true,
      message: `${coin.name} (${coin.symbol}) added successfully`,
      data: coin,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    console.error('[addCrypto]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
