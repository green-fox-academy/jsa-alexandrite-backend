const jwtVerifier = require('express-jwt');
const { Router } = require('express');
const fetch = require('node-fetch');
const Transaction = require('../models/transaction');

const router = Router();

const secret = process.env.ACCESS_TOKEN_SECRET;

const order = async (req, res) => {
  try {
    const { API_URL, API_KEY } = process.env;
    const {
      shares, price, symbol, type,
    } = req.body;
    const url = new URL(`${API_URL}/stock/${symbol}/batch`);
    url.searchParams.append('types', 'quote,company');
    url.searchParams.append('token', API_KEY);
    const result = fetch(url);
    console.log(result);
    const { id } = req.user;
    const status = 'failed';
    const orderTransaction = new Transaction(
      {
        user: id, shares, price, symbol, type, status,
      },
    );
    orderTransaction.save((err) => {
      if (err) return res.status(500).send(err);
      return res.status(201).send(orderTransaction);
    });
  } catch (err) {
    console.error(err);
  }
};

router.post('/', jwtVerifier({ secret }), order);

module.exports = router;
