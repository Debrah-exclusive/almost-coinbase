import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    change24h: {
      type: Number,
      default: 0,
      comment: 'Percentage change in price over the last 24 hours, e.g. +2.5 or -1.3',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Crypto', cryptoSchema);
