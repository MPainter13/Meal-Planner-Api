require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const mealsRouter = require('./meal/meal-router');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

//Routers
app.use('/meals', mealsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' })
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});




module.exports = app;