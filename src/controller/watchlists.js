const express = require('express');
const { User } = require('../models');

const watchlists = express.Router();

watchlists.post('/backup', async (req, res) => {
  const id = '5e01dc0fd399fd162f3e5788';
  try {
    const user = await User.findById(id);
    if (!Array.isArray(req.body)) return res.sendStatus(400);
    if (!user) return res.sendStatus(404);
    user.watchlists = req.body;
    const result = await user.save();
    return res.send(result.watchlists);
  } catch (err) {
    return res.sendStatus(500);
  }
});

watchlists.get('/restore', async (req, res) => {
  const id = '5e01dc0fd399fd162f3e5788';
  try {
    const user = await User.findById(id);
    if (!user) return res.sendStatus(400);
    return res.send(user.watchlists);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = watchlists;
