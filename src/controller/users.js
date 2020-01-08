const jwt = require('jsonwebtoken');
const jwtVerifier = require('express-jwt');
const { errors } = require('passport-local-mongoose');
const { Router } = require('express');
const { User } = require('../models');

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

module.exports = router;
