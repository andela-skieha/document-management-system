/* eslint-disable new-cap */
/* eslint-disable no-console */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./server/routes');

const app = express();
const apiRouter = express.Router();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes(apiRouter));

app.use((req, res, next) => {
  res.setHeader('Access-Coontrol-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  next();
});

mongoose.connect('mongodb://localhost/dms', (err) => {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log('Connection error', err);
  } else {
    console.log('Listening on port:', port);
  }
});
