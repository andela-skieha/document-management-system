/* eslint-disable new-cap */
/* eslint-disable no-console */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./server/routes');
const config = require('./server/config');

const app = express();
const apiRouter = express.Router();

const env = process.env.NODE_ENV;
if (env === 'test') {
  config.database = config.test_database;
  config.port = 8080;
}

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', routes(apiRouter));

app.use((req, res, next) => {
  res.setHeader('Access-Coontrol-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  next();
});

mongoose.connect(config.database, (err) => {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.log('Connection error', err);
  } else {
    console.log('Listening on port:', config.port);
  }
});

module.exports = app;
