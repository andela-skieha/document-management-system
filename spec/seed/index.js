/* eslint-disable no-console */

const mongoose = require('mongoose');
const seedData = require('./data');
const User = require('../../server/models/user');
const Document = require('../../server/models/document');
const config = require('../../server/config');

mongoose.connect(config.test_database, (err) => {
  if (err) console.error('Mongoose error: ', err);
});

mongoose.connection.on('connected', () => {
  User.create(seedData.users, (err) => {
    if (err) console.error(err);
    process.exit();
  });

  Document.create(seedData.documents, (err) => {
    if (err) console.error(err);
    process.exit();
  });
});
