const express = require('express');
const jwtVerifier = require('express-jwt');

const secret = process.env.ACCESS_TOKEN_SECRET;

const account = express.Router();
const { User } = require('../models');

account.get('/user', jwtVerifier({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.find({ _id: id }, '-_id username balance');
    return res.send(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

account.post('/topup', jwtVerifier({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
    const { topup } = req.body;
    const balance = await User.findById(id, 'balance');
    const result = balance.balance + topup;
    try {
      await User.updateOne({ _id: id }, { $set: { balance: result } });
      return res.json({ balance: result });
    } catch (err) {
      return res.sendStatus(500);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = account;
