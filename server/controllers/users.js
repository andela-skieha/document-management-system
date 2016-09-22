/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');
const Document = require('../models/document');
const Role = require('../models/role');
const config = require('../config');

module.exports = {

  signup: (req, res) => {
    const user = new User();
    user.username = req.body.username;
    user.name = { firstname: req.body.firstname, lastname: req.body.lastname };
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
        res.status(201).send({
          message: 'User created successfully.',
          user,
        });
      }
    });
  },

  login: (req, res) => {
    User.findOne({
      username: req.body.username,
    })
   .select('username password')
   .exec((err, user) => {
     if (err) throw err;

     if (!user) {
       res.status(404).send({ error: 'User not found.' });
     } else if (user) {
       bcrypt.compare(req.body.password, user.password, (error, result) => {
         if (result !== true) {
           res.status(403).send({ error: 'Wrong password supplied' });
         } else {
           const userData = {
             _id: user._id,
             email: user.email,
           };
           const dmsToken = jwt.sign(userData, config.secret, { expiresIn: 86400 });

           res.status(200).send({
             message: 'User logged in',
             token: dmsToken,
             user_id: user._id,
           });
         }
       });
     }
   });
  },

  all: (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.status(500).send({ error: 'Could not fetch users.' });
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
        res.status(404).send({ error: 'User does not exist.' });
      } else {
        res.status(200).send(user);
      }
    });
  },

  update: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
      } else if (req.decoded._id == req.params.user_id) {
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
      } else if (req.decoded._id == req.params.user_id) {
        Document.remove({ owner: req.params.user_id }, (docError) => {
          if (docError) {
            res.status(400).send({ error: 'Could not delete user.' });
          } else {
            Role.remove({ owner: req.params.user_id }, (roleError) => {
              if (roleError) {
                res.status(400).send({ error: 'Could not delete user.' });
              } else {
                user.remove((userError) => {
                  if (userError) {
                    res.status(400).send({ error: 'Could not delete user.' });
                  } else {
                    res.status(200).send({ message: 'User deleted successfully.' });
                  }
                });
              }
            });
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

  getUserRoles: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err || user === null) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }
      Role.find({ owner: user._id }, (error, roles) => {
        if (error) {
          res.status(400).send({ error: 'Could not fetch roles.' });
        } else if (roles.length === 0) {
          res.status(404).send({ error: 'No roles found.' });
        } else {
          res.status(200).send(roles);
        }
      });
    });
  },
};
