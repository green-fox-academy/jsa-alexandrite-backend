const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  shares: Number,
  price: Number,
  symbol: String,
  type: {
    type: String,
    enum: ['buy', 'sell'],
  },
  status: {
    type: String,
    enum: ['settled', 'failed'],
  },
});

const Transaction = model('Transaction', transactionSchema);
module.exports = Transaction;
