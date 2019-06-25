const dotenv = require('dotenv');

if (process.env.NODE_ENV) {
  dotenv.config({
    path: `./.env.${process.env.NODE_ENV}`,
  });
} else {
  throw new Error('NODE_ENV must be defined');
}

const { logger } = require('./configs/logger');
global.logger = logger;

const express = require('express');

const morgan = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const messagesRouter = require('./routes/messages');
const filtersRouter = require('./routes/filters');

const app = express();
const cors = require('cors');

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/messages', messagesRouter);
app.use('/filters', filtersRouter);

app.use(function(req, res) {
  res.status(404).json({ details: 'Not Found!' });
});
module.exports = app;
