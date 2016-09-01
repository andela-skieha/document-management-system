/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

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

  users(apiRouter);

  return apiRouter;
};
