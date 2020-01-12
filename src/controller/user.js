const jwt = require('jsonwebtoken');
const jwtVerifier = require('express-jwt');
const { errors } = require('passport-local-mongoose');
const { Router } = require('express');
const { User, Transaction } = require('../models');

const secret = process.env.ACCESS_TOKEN_SECRET;

const router = Router();

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const auth = User.authenticate();
    const { user, error } = await auth(username, password);
    if (user) {
      // eslint-disable-next-line no-underscore-dangle
      const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: '7days' });
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
router.get('/account', jwtVerifier({ secret }), (req, res) => {
  res.send({
    id: req.user.id,
    message: 'congratulations you made it home',
  });
});

router.get('/transactions', jwtVerifier({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
    const { limit } = req.query;
    const transactions = (await Transaction.find({ user: id }).limit(parseInt(limit, 10)))
      .map((trans) => {
        const { _id, ...rest } = trans.toJSON();
        return {
          ...rest,
          id: _id,
        };
      });
    res.send(transactions);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/profile', jwtVerifier({ secret }), async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id, '-_id username balance');
    return res.send(user);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = router;
