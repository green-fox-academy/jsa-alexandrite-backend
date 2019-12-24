const { Router } = require('express');
const users = require('../data/users');

const router = Router();

// eslint-disable-next-line consistent-return
async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.sendStatus(400);
  }
  try {
    const [user] = users;
    if (user) {
      if (user.password === password) {
        const accessToken = 'little-pony';
        return res.send({ accessToken });
      }
      return res.status(401).send({ message: 'wrong password' });
    }
    res.sendStatus(404).send({ message: 'user not exists' });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
router.post('/login', loginUser);

module.exports = router;
