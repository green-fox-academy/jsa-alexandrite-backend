const express = require('express');
const jwtVerifier = require('express-jwt');

const secret = process.env.ACCESS_TOKEN_SECRET;

const investments = express.Router();
const { User } = require('../models');

investments.get('/user', jwtVerifier({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ _id: id }, '-_id investments');
    const result = user.investments.map(({
      _id,
      symbol,
      shares,
      sector,
    }) => ({
      id: _id,
      symbol,
      shares,
      sector,
    }));
    return res.send(result);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = investments;
