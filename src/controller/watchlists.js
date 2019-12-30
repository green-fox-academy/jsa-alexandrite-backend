const express = require('express');
const { User } = require('../models');

const watchlists = express.Router();

watchlists.post('/backup', async (req, res) => {
  const id = '5e01dc0fd399fd162f3e5788';
  try {
    const user = await User.findById(id);
    user.watchlists = req.body;
    const result = await user.save();
    return res.send(result);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = watchlists;
