const Documents = require('../controllers/documents');
const Search = require('../controllers/search');

module.exports = (router) => {
  router.route('/documents')
    .post(Documents.create)
    .get(Documents.all);

  router.route('/documents/:id')
    .get(Documents.find)
    .put(Documents.update)
    .delete(Documents.delete);

  router.route('/search')
    .get(Search.search);
};
