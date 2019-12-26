const { Schema, model } = require('mongoose');

const pendingTransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  shares: Number,
  price: Number,
  symbol: String,
  type: {
    type: String,
    enum: ['buy', 'sell'],
  },
});

const PendingTransaction = model('PendingTransaction', pendingTransactionSchema);

module.exports = PendingTransaction;
