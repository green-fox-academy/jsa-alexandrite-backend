require('dotenv').config();
const express = require('express');
const passport = require('passport');
const investments = require('./controller/investments');
const { db, User } = require('./models');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to database');
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const { users } = require('./controller');

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/investments', investments);
app.use('/users', users);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`the app is running at port ${PORT}`);
});

module.exports = app;
