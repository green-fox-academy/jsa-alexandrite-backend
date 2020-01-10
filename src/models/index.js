const mongoose = require('mongoose');
const User = require('./user');
const PendingTransaction = require('./pendingTransaction');
const Transaction = require('./transaction');
const { Watchlist } = require('./watchlist');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

module.exports = {
  db,
  User,
  PendingTransaction,
  Transaction,
  Watchlist,
};
