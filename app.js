require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/error-database',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
const { PORT } = process.env;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
