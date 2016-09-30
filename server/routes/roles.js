const Roles = require('../controllers/roles');
const Auth = require('../controllers/auth');

module.exports = (router) => {
  router.use(Auth.auth);

  router.route('/roles')
    .post(Roles.create)
    .get(Roles.all);

  router.route('/roles/:id')
    .get(Roles.findOne)
    .put(Roles.updateOne)
    .delete(Roles.deleteOne);
};
