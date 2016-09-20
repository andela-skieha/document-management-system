/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

const Document = require('../models/document');

module.exports = {
  create: (req, res) => {
    const document = new Document();
    document.title = req.body.title;
    document.content = req.body.content;
    document.role = req.body.role;
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
    Document
    .find({})
    .skip(parseInt(req.query.offset, 10))
    .limit(parseInt(req.query.limit, 10))
    .sort({ createdAt: -1 })
    .populate('owner role', 'username title -_id')
    .exec((err, documents) => {
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
    Document.findById(req.params.id)
    .populate({
      path: 'role owner',
      populate: {
        path: 'members',
        select: 'username -_id',
      },
    })
    .exec((err, document) => {
      if (err || document === null) {
        res.status(404).send({ error: 'Could not find document.' });
      } else if (document.role === undefined) {
        const documentFound = {
          title: document.title,
          content: document.content,
          owner: document.owner.username,
        };

        res.status(200).send(documentFound);
      } else {
        const documentFound = {
          title: document.title,
          content: document.content,
          owner: document.owner.username,
          role: {
            title: document.role.title,
            members: document.role.members,
          },
        };

        res.status(200).send(documentFound);
      }
    });
  },

  update: (req, res) => {
    Document.findById(req.params.id)
    .exec((err, document) => {
      if (err || document === null) {
        res.status(404).send({ error: 'Document not found.' });
      } else if (req.decoded._id === document.owner) {
        Object.keys(req.body).forEach((key) => {
          document[key] = req.body[key];
        });

        document.save((error) => {
          if (error) {
            if (error.code === 11000) {
              res.status(409).send({ error: 'Duplicate entry.' });
              return;
            }
          } else if (Object.keys(req.body).length === 0) {
            res.status(400).send({ error: 'Nothing to update.' });
          } else {
            res.status(200).send({ message: 'Document updated successfully.' });
          }
        });
      } else {
        res.status(403).send({ error: 'Cannot edit document you did not create.' });
      }
    });
  },

  delete: (req, res) => {
    Document.findById(req.params.id)
    .populate('owner', '_id')
    .exec((err, document) => {
      if (err || document === null) {
        res.status(404).send({ error: 'Document not found.' });
      } else if (req.decoded._id === document.owner._id) {
        document.remove((error) => {
          if (error) {
            res.status(400).send({ error: 'Could not delete document.' });
          } else {
            res.status(200).send({ message: 'Document deleted successfully.' });
          }
        });
      } else {
        res.status(403).send({ error: 'Cannot delete document you did not create.' });
      }
    });
  },
};
