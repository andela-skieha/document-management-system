const Users = require('../controllers/users');

module.exports = (router) => {
  router.route('/users')
    .post(Users.create)
    .get(Users.all);
};
