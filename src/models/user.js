const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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
    entryPrice: Number,
  }],
  watchlists: [Schema.Types.ObjectId],
});

userSchema.plugin(passportLocalMongoose);

const User = model('User', userSchema);

module.exports = User;
