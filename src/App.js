require('dotenv').config();
const express = require('express');

const { PORT } = process.env;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('the app is running');
});

module.exports = app;
