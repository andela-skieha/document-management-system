/* eslint-disable no-console */

const mongoose = require('mongoose');
const config = require('../../server/config');
const seedData = require('./data');

const User = require('../../server/models/user');
const Document = require('../../server/models/document');
const Role = require('../../server/models/role');

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

  Role.create(seedData.roles, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully seeded roles');
    }
  });
});
