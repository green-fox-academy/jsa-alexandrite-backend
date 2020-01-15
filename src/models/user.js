const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { watchlistSchema } = require('./watchlist');


const investmentSchema = new Schema({
  symbol: String,
  shares: Number,
  sector: String,
  entryPrice: Number,
});

const userSchema = new Schema({
  username: { type: String, required: true },
  balance: {
    type: Number,
    default: 0,
  },
  investments: [investmentSchema],
  watchlists: [watchlistSchema],
});

userSchema.plugin(passportLocalMongoose);

const User = model('User', userSchema);

module.exports = User;
