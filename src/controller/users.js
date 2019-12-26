const { errors } = require('passport-local-mongoose');
const { Router } = require('express');
const { User } = require('../models');

const router = Router();

// eslint-disable-next-line consistent-return
async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  try {
    const auth = User.authenticate();
    const { user, error } = await auth(username, password);
    if (user) {
      const accessToken = 'little-pony';
      return res.send({ accessToken });
    }
    throw error;
  } catch (err) {
    console.error(err);
    if (err instanceof errors.AuthenticationError) {
      return res.status(401).send(err);
    }
    res.sendStatus(500);
  }
}
router.post('/login', loginUser);

module.exports = router;
