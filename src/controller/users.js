const jwt = require('jsonwebtoken');
const jwtVerifer = require('express-jwt');
const { errors } = require('passport-local-mongoose');
const { Router } = require('express');
const { User } = require('../models');

const secret = process.env.ACCESS_TOKEN_SECRET;
const expirationDate = Math.floor(Date.now() / 1000) + 30;

const router = Router();

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const auth = User.authenticate();
    const { user, error } = await auth(username, password);
    if (user) {
      const accessToken = jwt.sign({ name: user.username, exp: expirationDate }, secret);
      return res.send({ accessToken });
    }
    throw error;
  } catch (err) {
    console.error(err);
    if (err instanceof errors.AuthenticationError) {
      return res.status(401).send(err);
    }
    return res.sendStatus(500);
  }
};

router.post('/login', loginUser);
router.get('/account', jwtVerifer({ secret }), (req, res) => {
  res.send({
    name: req.user.name,
    exp: req.user.expirationDate,
    now: Date.now(),
    message: 'congratulations you made it home',
  });
});

module.exports = router;
