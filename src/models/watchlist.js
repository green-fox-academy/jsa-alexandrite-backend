const { Schema, model } = require('mongoose');

const watchlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stocks: [String],
});

const Watchlist = model('Watchlist', watchlistSchema);
module.exports = Watchlist;
