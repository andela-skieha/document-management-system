/* eslint-disable no-console */

const mongoose = require('mongoose');
const config = require('../../server/config');
const User = require('../../server/models/user');
const Document = require('../../server/models/document');

mongoose.connect(config.test_database, (err) => {
  if (err) console.error('Mongoose error: ', err);
});

mongoose.connection.on('connected', () => {
  User.remove({}, (err) => {
    if (err) console.error(err);
  });

  Document.remove({}, (err) => {
    if (err) console.error(err);
    process.exit();
  });
});
