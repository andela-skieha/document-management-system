/* eslint-disable no-console */
/* eslint-disable new-cap */

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const seedData = require('./data');
const User = require('../../server/models/user');
const Document = require('../../server/models/document');
const config = require('../../server/config');
const routes = require('../../server/routes');

const app = express();
const apiRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', routes(apiRouter));

app.use((req, res, next) => {
  res.setHeader('Access-Coontrol-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  next();
});

mongoose.connect(config.test_database, (err) => {
  if (err) console.error('Mongoose error: ', err);
});

mongoose.connection.on('connected', () => {
  User.create(seedData.users, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully seeded users');
    }
    process.exit();
  });

  Document.create(seedData.documents, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully seeded documents');
    }
  });
});

module.exports = app;
