import express from 'express';
import {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  addCrypto,
} from '../controllers/cryptoController.js';

const router = express.Router();

// GET /api/crypto/gainers  — must be BEFORE /api/crypto/:id if you ever add one
router.get('/gainers', getTopGainers);

// GET /api/crypto/new
router.get('/new', getNewListings);

// GET /api/crypto — all tradable cryptocurrencies
router.get('/', getAllCrypto);

// POST /api/crypto — add a new cryptocurrency
router.post('/', addCrypto);

export default router;
