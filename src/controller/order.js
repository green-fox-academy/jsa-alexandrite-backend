const jwtVerifier = require('express-jwt');
const { Router } = require('express');
const fetch = require('node-fetch');
const Transaction = require('../models/transaction');

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
    const status = 'failed';
    const price = data.quote.latestPrice;
    const orderTransaction = new Transaction(
      {
        user: id, shares, price, symbol, type, status,
      },
    );
    orderTransaction.save((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).send('OK');
    });
  } catch (err) {
    console.error(err);
  }
};

router.post('/', jwtVerifier({ secret }), order);

module.exports = router;
