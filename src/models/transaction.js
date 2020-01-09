const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  shares: {
    type: Number,
    required() {
      return this.type !== 'topUp';
    },
  },
  price: {
    type: Number,
    required() {
      return this.type !== 'topUp';
    },
  },
  amount: {
    type: Number,
    required() {
      return this.type === 'topUp';
    },
  },
  symbol: String,
  type: {
    type: String,
    enum: ['buy', 'sell', 'topUp'],
  },
  status: {
    type: String,
    enum: ['settled', 'failed'],
  },
}, { versionKey: false });

const Transaction = model('Transaction', transactionSchema);
module.exports = Transaction;
