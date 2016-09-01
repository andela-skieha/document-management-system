const Documents = require('../controllers/documents');

module.exports = (router) => {
  router.route('/documents')
    .post(Documents.create)
    .get(Documents.all);
};
