const { Router } = require('express');
const users = require('../data/users');

const router = Router();


// eslint-disable-next-line consistent-return
async function loginUser(req, res, next) {
  const { userName, passWord } = req.body;
  if (!userName || !passWord) {
    return res.sendStatus(400);
  }
  try {
    const [user] = users;
    if (user.userName === userName && user.passWord === passWord) {
      const accessTocken = 'little-pony';
      const { userId } = user;
      return res.send({ userId, accessTocken });
    }
    return res.status(400).send({ message: 'Wrong password' });
  } catch (err) {
    next(err);
  }
}


router.post('/login', loginUser);

module.exports = router;
