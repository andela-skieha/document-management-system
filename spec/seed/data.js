/* eslint-disable new-cap */

const mongoose = require('mongoose');

module.exports = {
  users: [
    {
      _id: mongoose.Types.ObjectId('57c96a56cd9ca231483f082b'),
      username: 'janedoe',
      name: {
        firstname: 'Jane',
        lastname: 'Doe',
      },
      email: 'jane@doe.com',
      password: 'password1',
    },

    {
      _id: mongoose.Types.ObjectId('57c96a56cd9ca231483f0829'),
      username: 'johndoe',
      name: {
        firstname: 'John',
        lastname: 'Doe',
      },
      email: 'john@doe.com',
      password: 'password2',
    },

    {
      _id: mongoose.Types.ObjectId('9e799c0e692b79bdc83f082a'),
      username: 'maybesydney',
      name: {
        firstname: 'Sydney',
        lastname: 'Maybe',
      },
      email: 'sydney@maybe.com',
      password: 'password3',
    },

    {
      _id: mongoose.Types.ObjectId('57c96a56cd9ca231483f082c'),
      username: 'wonderwall',
      name: {
        firstname: 'Wonder',
        lastname: 'Wall',
      },
      email: 'wonder@wall.com',
      password: 'password4',
    },
  ],

  documents: [
    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd0a'),
      title: 'Harry Potter',
      content: 'The boy who lived',
      owner: mongoose.Types.ObjectId('57c96a56cd9ca231483f082c'),
    },

    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd09'),
      title: 'Lord of the Rings',
      content: 'Weird magical creatures',
      owner: mongoose.Types.ObjectId('57c96a56cd9ca231483f082c'),
    },

    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd08'),
      title: 'The Opposite of Loneliness',
      content: 'Awesome compilation of stories',
      owner: mongoose.Types.ObjectId('9e799c0e692b79bdc83f082a'),
    },

    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd07'),
      title: 'Nancy Drew',
      content: 'Mystery solving babe',
      owner: mongoose.Types.ObjectId('57c96a56cd9ca231483f082b'),
    },

    {
      _id: mongoose.Types.ObjectId('57c96a56cd9ca231483f082c'),
      title: 'Hardy Boys',
      content: 'Mystery solving dudes',
      owner: mongoose.Types.ObjectId('57c96a56cd9ca231483f082b'),
    },
  ],
};
