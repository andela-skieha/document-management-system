const Document = require('../models/document');

module.exports = {
  search: (req, res) => {
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));
      Document
      .find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
      .limit(parseInt(req.query.limit, 10))
      .sort({ createdAt: -1 })
      .populate('owner role', 'username title -_id')
      .exec((err, documents) => {
        if (err || documents.length === 0) {
          res.status(404).send({ error: `No documents created on ${req.query.date} were found.` });
        } else {
          res.status(200).send(documents);
        }
      });
    } else {
      res.status(400).send({ error: 'No search terms provided.' });
    }
  },
};
