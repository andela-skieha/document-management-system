/* eslint-disable no-console */

const MongoClient = require('mongodb').MongoClient;
// const config = require('../../server/config');
const seedData = require('./data');

const url = 'mongodb://localhost/dms-test';

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.error('Mongoose error: ', err);
  } else {
    const users = db.collection('users');
    const documents = db.collection('documents');

    users.insert(seedData.users, (error) => {
      if (err) {
        console.error(error);
      } else {
        console.log('Successfully seeded users');
      }
    });

    documents.insert(seedData.documents, (error) => {
      if (err) {
        console.error(error);
      } else {
        console.log('Successfully seeded documents');
      }
      process.exit();
    });
  }
});
