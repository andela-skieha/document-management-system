/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

const users = require('./users');

module.exports = (apiRouter) => {
  users(apiRouter);

  return apiRouter;
};
