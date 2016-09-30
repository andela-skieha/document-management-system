/* eslint-disable no-console */

const mongoose = require('mongoose');
const config = require('../../server/config');
const User = require('../../server/models/user');
const Document = require('../../server/models/document');
const Role = require('../../server/models/role');

mongoose.connect(config.test_database, (err) => {
  if (err) console.error('Mongoose error: ', err);
});

mongoose.connection.on('connected', () => {
  User.remove({}, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully removed users');
    }
  });

  Document.remove({}, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully removed documents');
    }
  });

  Role.remove({}, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully removed roles');
    }
    process.exit();
  });
});
