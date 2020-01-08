const express = require('express');
const jwt = require('express-jwt');
const { User } = require('../models');

const watchlists = express.Router();
const { ACCESS_TOKEN_SECRET: secret } = process.env;

watchlists.post('/backup', jwt({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
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

watchlists.get('/restore', jwt({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) return res.sendStatus(400);
    return res.send(user.watchlists);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = watchlists;
