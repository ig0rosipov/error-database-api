require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');

const { PORT } = process.env;

mongoose.connect('mongodb://localhost:27017/error-database',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

const app = express();

app.use(express.json());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
