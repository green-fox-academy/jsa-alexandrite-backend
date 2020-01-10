const { Schema, model } = require('mongoose');

const watchlistSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  stocks: [String],
}, { _id: false, id: false });

const Watchlist = model('Watchlist', watchlistSchema);
module.exports = {
  Watchlist,
  watchlistSchema,
};
