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

    const data = await (await fetch(url)
      .then((response) => {
        if (!response.ok) {
          switch (response.status) {
            case 401:
              throw Error(`The stock ${symbol} you are searching for does not exist`);
            default:
              throw Error('Oop! there is something wrong with our app');
          }
        }
        return response.json();
      })
      .catch((error) => error)
    );

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
    const originalShare = originalShares[0];
    // compare shares with orginalShares
    let updatedBalance = 0;
    let updatedShares = 0;
    const stockTotalValue = shares * price;
    if (type === 'buy') {
      if (balance >= stockTotalValue) {
        updatedBalance = balance - stockTotalValue;
        updatedShares = originalShare + shares;
        // update User balance / investment shares & set status to 'settled'
        try {
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
          await User.updateOne({ _id: id }, { $set: { balance: updatedBalance } });
          await User.updateMany(
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
          res.status(201).json('save and update successfully');
        } catch (error) {
          console.error(error);
        }
      } else {
        // failed
        try {
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
          res.json('update fail');
          throw Error('Your balance is not enough');
        } catch (error) {
          console.error(error);
        }
      }
    } else if (type === 'sell') {
      if (originalShare >= shares) {
        updatedBalance = balance + stockTotalValue;
        updatedShares = originalShare - shares;
        // update User balance / investment shares & set status to 'settled'
        try {
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
          await User.updateOne({ _id: id }, { $set: { balance: updatedBalance } });
          await User.updateMany(
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
          res.status(201).json('create and update successfully');
        } catch (error) {
          console.error(error);
        }
      } else {
        // failed
        try {
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
        } catch (error) {
          console.error(error);
        }
      }
    }
    res.status(201);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

router.post('/', jwtVerifier({ secret }), order);

module.exports = router;
