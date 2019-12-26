const express = require('express');
const userInvestments = require('../models/data');

const investments = express.Router();

investments.get('/user/:uid', (req, res) => {
  const { uid } = req.params;
  const userData = userInvestments.find((data) => data.userId === uid);
  if (userData) {
    return res.send(userData);
  }
  return res.sendStatus(404);
});

module.exports = investments;
