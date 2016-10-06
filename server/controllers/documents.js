/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */

const Document = require('../models/document');
const Role = require('../models/role');

module.exports = {
  create: (req, res) => {
    const document = new Document();
    document.title = req.body.title;
    document.content = req.body.content;
    document.role = req.body.role;
    document.owner = req.decoded._id;

    document.save((err) => {
      let error;
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ error: 'Duplicate entry: Title already exists.' });
        } else {
          if (!req.body.title) error = err.errors.title.message;
          if (!req.body.content) error = err.errors.content.message;
          res.status(400).send({ error: `Error creating document: ${error}` });
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
    const query = {};
    const documentSearch = (options) => {
      Document
        .find(options)
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
    };

    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));
      query.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (req.query.role) {
      Role
        .findOne({ title: req.query.role })
        .exec((err, role) => {
          if (err || role === null) {
            res.status(404).send({ error: `Role ${req.query.role} does not exist.` });
          } else {
            const roleId = role._id;
            query.role = roleId;
            documentSearch(query);
          }
        });
    } else {
      documentSearch(query);
    }
  },

  find: (req, res) => {
    Document
      .findById(req.params.id)
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
    Document
      .findById(req.params.id, (err, document) => {
        if (err || document === null) {
          res.status(404).send({ error: 'Document not found.' });
        } else if (req.decoded._id == document.owner) {
          if (Object.keys(req.body).length === 0) {
            res.status(400).send({ error: 'Nothing to update.' });
            return;
          }

          Object.keys(req.body).forEach((key) => {
            document[key] = req.body[key];
          });

          document.save((error) => {
            if (error) {
              if (error.code === 11000) {
                res.status(409).send({ error: 'Duplicate entry: Title already exists.' });
              } else {
                res.status(500).send({ error });
              }
            } else {
              res.status(200).send({
                message: 'Document updated successfully.',
                document,
              });
            }
          });
        } else {
          res.status(403).send({ error: 'Cannot edit document you did not create.' });
        }
      });
  },

  delete: (req, res) => {
    Document
      .findById(req.params.id, (err, document) => {
        if (err || document === null) {
          res.status(404).send({ error: 'Document not found.' });
        } else if (req.decoded._id == document.owner) {
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
