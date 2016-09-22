/* eslint-disable no-param-reassign */

const jwt = require('jsonwebtoken');

const config = require('../config');

module.exports = {
  auth: (req, res, next) => {
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
  },
};
