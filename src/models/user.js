const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { watchlistSchema } = require('./watchlist');

const userSchema = new Schema({
  username: { type: String, required: true },
  balance: {
    type: Number,
    default: 0,
  },
  investments: [{
    symbol: String,
    shares: Number,
    sector: String,
  }],
  watchlists: [watchlistSchema],
});

userSchema.plugin(passportLocalMongoose);

const User = model('User', userSchema);

module.exports = User;
