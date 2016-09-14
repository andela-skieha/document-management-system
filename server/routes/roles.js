const Roles = require('../controllers/roles');

module.exports = (router) => {
  router.route('/roles')
    .post(Roles.create)
    .get(Roles.all);
};
