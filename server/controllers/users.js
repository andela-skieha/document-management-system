/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

const User = require('../models/user');
const Document = require('../models/document');

module.exports = {
  all: (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(400).send({ error: 'Could not fetch users.' });
      } else if (users.length === 0) {
        res.status(404).send({ error: 'No users to retrieve.' });
      } else {
        res.status(200).send(users);
      }
    });
  },

  find: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'Could not fetch user.' });
      } else {
        res.status(200).send(user);
      }
    });
  },

  update: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
      } else if (req.decoded.id === req.params.user_id) {
        if (req.body.username) user.username = req.body.username;
        if (req.body.firstname) user.name.firstname = req.body.firstname;
        if (req.body.lastname) user.name.lastname = req.body.lastname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;

        user.save((error) => {
          if (error) {
            if (error.code === 11000) {
              res.status(409).send({ error: 'Duplicate entry.' });
              return;
            }
          } else if (Object.keys(req.body).length === 0) {
            res.status(400).send({ error: 'Nothing to update.' });
          } else {
            res.status(200).send({ message: 'User updated successfully.' });
          }
        });
      } else {
        res.status(403).send({ error: 'Cannot update another user\'s details' });
      }
    });
  },

  delete: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
      } else if (req.decoded.id === req.params.user_id) {
        user.remove((error) => {
          if (error) {
            res.status(400).send({ error: 'Could not delete user.' });
          } else {
            res.status(200).send({ message: 'User deleted successfully.' });
          }
        });
      } else {
        res.status(403).send({ error: 'Cannot delete another user.' });
      }
    });
  },

  getUserDocuments: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }
      Document.find({ owner: user._id }, (error, documents) => {
        if (error) {
          res.status(400).send({ error: 'Could not fetch documents.' });
        } else if (documents.length === 0) {
          res.status(404).send({ error: 'No documents found.' });
        } else {
          res.status(200).send(documents);
        }
      });
    });
  },
};
