const express = require('express');
const userInvestments = require('../data/data');

const investments = express.Router();

investments.get('/user/:uid', (req, res) => {
  const { uid } = req.params;
  const userData = userInvestments.find((data) => data.userId === uid);
  if (userData) {
    return res.status(200).json({ userData });
  }
  return res.sendStatus(404);
});

module.exports = investments;
