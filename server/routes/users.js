const Users = require('../controllers/users');
const Auth = require('../controllers/auth');

module.exports = (router) => {
  router.post('/users/signup', Users.signup);
  router.post('/users/login', Users.login);

  router.use(Auth.auth);

  router.route('/users')
    .get(Users.all);

  router.route('/users/:user_id')
   .get(Users.find)
   .put(Users.update)
   .delete(Users.delete);

  router.get('/users/:user_id/documents', Users.getUserDocuments);
  router.get('/users/:user_id/roles', Users.getUserRoles);
};
