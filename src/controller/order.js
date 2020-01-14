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
      shares, symbol, type,
    } = req.body;
    const url = new URL(`${API_URL}/stock/${symbol}/batch`);
    url.searchParams.append('types', 'quote,company');
    url.searchParams.append('token', API_KEY);
    const data = await (await fetch(url)).json();
    const { id } = req.user;
    const price = data.quote.latestPrice;
    const { sector } = data.company;
    const user = await User.findById(id);
    const { investments, balance } = user;
    const originalShares = investments.map((investment) => {
      if (investment.symbol === symbol) {
        return investment.shares;
      }
      return 0;
    });
    // compare shares with orginalShares
    let updatedBalance = 0;
    let updatedShares = 0;
    const stockTotalValue = shares * price;
    if (type === 'buy') {
      if (balance >= stockTotalValue) {
        updatedBalance = balance - stockTotalValue;
        updatedShares = originalShares + shares;
        // update User balance / investment shares & set status to 'settled'
        const orderTransaction = new Transaction(
          {
            user: id,
            shares,
            price,
            symbol,
            type,
            status: 'settled',
          },
        );
        orderTransaction.save();
        User.updateOne({ _id: id }, { $set: { balance } });
        User.updateMany(
          { _id: id, 'investments.symbol': symbol },
          {
            $set: {
              'investments.$.shares': updatedShares,
              'investments.$.sector': sector,
              'investments.$.entryPrice': price,
            },
          },
          { upsert: true },
        );
      }
      // failed
      const orderTransaction = new Transaction(
        {
          user: id,
          shares,
          price,
          symbol,
          type,
          status: 'failed',
        },
      );
      orderTransaction.save();
      // throw error('balance is not enough');
      throw Error('Your balance is not enough');
    } else if (type === 'sell') {
      if (originalShares >= shares) {
        updatedBalance = balance + stockTotalValue;
        updatedShares = originalShares - shares;
        // update User balance / investment shares & set status to 'settled'
        const orderTransaction = new Transaction(
          {
            user: id,
            shares,
            price,
            symbol,
            type,
            status: 'settled',
          },
        );
        orderTransaction.save();
        User.updateOne({ _id: id }, { $set: { balance: updatedBalance } });
        User.updateMany(
          { 'investments.symbol': symbol },
          {
            $set: {
              'investments.$.shares': updatedShares,
              'investments.$.sector': sector,
              'investments.$.entryPrice': price,
            },
          },
          { upsert: true },
        );
      } else {
        // failed
        const orderTransaction = new Transaction(
          {
            user: id,
            shares,
            price,
            symbol,
            type,
            status: 'failed',
          },
        );
        orderTransaction.save();
        // throw error ('stock shares are not enough');
        throw Error('Your stock shares are fewer than what you have');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

router.post('/', jwtVerifier({ secret }), order);

module.exports = router;
