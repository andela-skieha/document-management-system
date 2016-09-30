const users = require('./users');
const documents = require('./documents');
const roles = require('./roles');

module.exports = (apiRouter) => {
  users(apiRouter);
  documents(apiRouter);
  roles(apiRouter);

  return apiRouter;
};
