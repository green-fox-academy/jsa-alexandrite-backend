const express = require('express');
const jwtVerifier = require('express-jwt');

const secret = process.env.ACCESS_TOKEN_SECRET;

const account = express.Router();
const { User } = require('../models');

account.get('/user', jwtVerifier({ secret }), async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.find({ _id }, {
      _id: false,
      username: true,
      balance: true,
    });
    return res.send(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = account;
