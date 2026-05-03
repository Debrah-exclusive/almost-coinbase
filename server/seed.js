import mongoose from 'mongoose';
import 'dotenv/config';
import Crypto from './models/Crypto.js';

const initialCoins = [
  { name: 'Bitcoin', symbol: 'BTC', price: 65432.10, image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', change24h: 2.5 },
  { name: 'Ethereum', symbol: 'ETH', price: 3456.78, image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', change24h: -1.2 },
  { name: 'Solana', symbol: 'SOL', price: 145.20, image: 'https://cryptologos.cc/logos/solana-sol-logo.png', change24h: 5.8 },
  { name: 'Cardano', symbol: 'ADA', price: 0.45, image: 'https://cryptologos.cc/logos/cardano-ada-logo.png', change24h: -0.5 },
  { name: 'Ripple', symbol: 'XRP', price: 0.62, image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', change24h: 1.1 },
  { name: 'Polkadot', symbol: 'DOT', price: 7.20, image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', change24h: -2.3 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.15, image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png', change24h: 12.4 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing
    await Crypto.deleteMany({});
    console.log('Cleared existing crypto data.');

    // Insert new
    await Crypto.insertMany(initialCoins);
    console.log('Successfully seeded database with initial coins! ✅');
    
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
