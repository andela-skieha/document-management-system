/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');

const secret = 'this is super secret';
const users = require('./users');

module.exports = (apiRouter) => {
  apiRouter.post('/users/login', (req, res) => {
    User.findOne({
      email: req.body.email,
    })
   .select('email password')
   .exec((err, user) => {
     if (err) throw err;

     if (!user) {
       res.status(404).send({ error: 'User not found.' });
     } else if (user) {
       bcrypt.compare(req.body.password, user.password, (error, result) => {
         if (result !== true) {
           res.json({
             error: 'Wrong password supplied',
           });
         } else {
           const userData = {
             _id: user._id,
             email: user.email,
           };
           const dmsToken = jwt.sign(userData, secret, { expiresIn: 86400 });

           res.json({
             message: 'User logged in',
             token: dmsToken,
           });
         }
       });
     }
   });
  });

  apiRouter.use((req, res, next) => {
    const dmsToken = req.body.dmsToken || req.query.dmsToken || req.headers['x-access-token'];
    if (dmsToken) {
      jwt.verify(dmsToken, secret, (err, decoded) => {
        if (err) {
          res.status(403).send({ message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({ message: 'You are not authenticated.' });
    }
  });

  users(apiRouter);

  return apiRouter;
};
