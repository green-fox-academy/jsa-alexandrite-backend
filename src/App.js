require('dotenv').config();
const express = require('express');
const investments = require('./controller/investments');

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use('/investments', investments);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`the app is running at port ${PORT}`);
});

module.exports = app;
