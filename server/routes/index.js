/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const users = require('./users');
const documents = require('./documents');
const roles = require('./roles');
const config = require('../config');

module.exports = (apiRouter) => {
  apiRouter.post('/users/signup', (req, res) => {
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
  });

  apiRouter.post('/users/login', (req, res) => {
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
  });

  apiRouter.use((req, res, next) => {
    const dmsToken = req.body.dmsToken || req.query.dmsToken || req.headers['x-access-token'];
    if (dmsToken) {
      jwt.verify(dmsToken, config.secret, (err, decoded) => {
        if (err) {
          res.status(403).send({ message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'You are not authenticated.' });
    }
  });

  users(apiRouter);
  documents(apiRouter);
  roles(apiRouter);

  return apiRouter;
};
