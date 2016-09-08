/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

const Document = require('../models/document');

module.exports = {
  create: (req, res) => {
    const document = new Document();
    document.title = req.body.title;
    document.content = req.body.content;
    document.owner = req.decoded._id;

    document.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ error: 'Duplicate entry.' });
        } else {
          res.status(400).send({ error: 'Error creating document.' });
        }
      } else {
        res.status(201).send({
          message: 'Document created successfully.',
          document,
        });
      }
    });
  },

  all: (req, res) => {
    Document.find({}, (err, documents) => {
      if (err) {
        res.status(400).send({ error: 'Could not fetch documents.' });
      } else if (documents.length === 0) {
        res.status(404).send({ error: 'No documents to retrieve.' });
      } else {
        res.status(200).send(documents);
      }
    });
  },

  find: (req, res) => {
    Document.findById(req.params.id, (err, document) => {
      if (err || document === null) {
        res.status(404).send({ error: 'Could not find document.' });
      } else {
        res.status(200).send(document);
      }
    });
  },

  update: (req, res) => {
    Document.findById(req.params.id, (err, document) => {
      if (err || document === null) {
        res.status(404).send({ error: 'Document not found.' });
        return;
      }
      Object.keys(req.body).forEach((key) => {
        document[key] = req.body[key];
      });

      document.save((error) => {
        if (error) {
          if (error.code === 11000) {
            res.status(409).send({ error: 'Duplicate entry.' });
          } else {
            res.status(400).send({ error: 'Error updating document.' });
          }
        } else {
          res.status(201).send({ message: 'Document updated successfully.' });
        }
      });
    });
  },

  delete: (req, res) => {
    Document.findById(req.params.id, (err, document) => {
      if (err || document === null) {
        res.status(404).send({ error: 'Document not found.' });
        return;
      }
      document.remove((error) => {
        if (error) {
          res.status(400).send({ error: 'Could not delete document.' });
        } else {
          res.status(200).send({ message: 'Document deleted successfully.' });
        }
      });
    });
  },
};
