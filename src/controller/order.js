const jwtVerifier = require('express-jwt');
const { Router } = require('express');
const fetch = require('node-fetch');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const router = Router();

const secret = process.env.ACCESS_TOKEN_SECRET;
const { API_URL, API_KEY } = process.env;

const order = async (req, res) => {
  try {
    const {
      shares, symbol, type, status, balance,
    } = req.body;
    const url = new URL(`${API_URL}/stock/${symbol}/batch`);
    url.searchParams.append('types', 'quote,company');
    url.searchParams.append('token', API_KEY);
    const data = await (await fetch(url)).json();
    const { id } = req.user;
    const price = data.quote.latestPrice;
    const { sector } = data.company;
    const user = await User.findById(id);
    const { investments } = user;
    const originalShares = investments.map((investment) => {
      if (investment.symbol === symbol) {
        return investment.shares;
      }
      return 0;
    });
    let totalShares = 0;
    if (status === 'settled') {
      if (type === 'buy') {
        totalShares = shares + originalShares;
      } else if (type === 'sell') {
        if (originalShares >= shares) {
          totalShares = originalShares - shares;
        } else {
          throw Error('Your stock shares are fewer than what you have');
        }
      }
    }
    const orderTransaction = new Transaction(
      {
        user: id,
        shares,
        price,
        symbol,
        type,
        status,
      },
    );
    orderTransaction.save((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).send('OK');
    });
    await User.updateOne({ _id: id }, { $set: { balance } });
    await User.update(
      { 'investments.shares': symbol },
      { $set: { 'investments.$.shares': totalShares, 'investments.$.sector': sector } },
      { upsert: true },
    );
  } catch (err) {
    console.error(err);
  }
};


router.post('/', jwtVerifier({ secret }), order);

module.exports = router;
