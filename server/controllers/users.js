/* eslint-disable no-param-reassign */

const User = require('../models/user');

module.exports = {
  create: (req, res) => {
    const user = new User();
    user.username = req.body.username;
    user.name = { first: req.body.first, last: req.body.last };
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ message: 'Duplicate user entry.' });
        } else {
          res.status(400).send({ message: 'Error creating user.' });
        }
      } else {
        res.status(201).send({ message: 'User created successfully.' });
      }
    });
  },

  all: (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(400).send({ error: 'Could not fetch users.' });
      } else if (users.length === 0) {
        res.status(404).send({ error: 'No users to retrieve.' });
      } else {
        res.json(users);
      }
    });
  },

  find: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'Could not fetch user.' });
      } else {
        res.json(user);
      }
    });
  },

  update: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'USer not found..' });
        return;
      }
      if (req.body.username) user.username = req.body.username;
      if (req.body.first) user.name.first = req.body.first;
      if (req.body.last) user.name.last = req.body.last;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.save((error) => {
        if (error) {
          if (error.code === 11000) {
            res.status(409).send({ error: 'Duplicate entry.' });
          } else {
            res.status(400).send({ error: 'Error updating user.' });
          }
        } else {
          res.status(201).send({ message: 'User updated successfully.' });
        }
      });
    });
  },

  delete: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }
      user.remove((error) => {
        if (error) {
          res.status(400).send({ error: 'Could not delete user.' });
        } else {
          res.send({ message: 'User deleted successfully.' });
        }
      });
    });
  },
};
