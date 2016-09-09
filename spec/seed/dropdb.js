/* eslint-disable no-console */

const MongoClient = require('mongodb').MongoClient;
// const config = require('../../server/config');

const url = 'mongodb://localhost/dms-test';

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.error('Mongoose error: ', err);
  } else {
    const users = db.collection('users');
    const documents = db.collection('documents');

    users.remove((error) => {
      if (err) {
        console.error(error);
      } else {
        console.log('Successfully removed users');
      }
    });

    documents.remove((error) => {
      if (err) {
        console.error(error);
      } else {
        console.log('Successfully removed documents');
      }
      process.exit();
    });
  }
});
