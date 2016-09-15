/* eslint-disable no-underscore-dangle */

const Role = require('../models/role');

module.exports = {
  create: (req, res) => {
    const role = new Role();
    role.title = req.body.title;
    role.owner = req.decoded._id;
    role.members = req.body.members;


    role.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ error: 'Duplicate entry.' });
        } else {
          res.status(400).send({ error: 'Error creating role.' });
        }
      } else {
        res.status(201).send({
          message: 'Role created successfully.',
          role,
        });
      }
    });
  },

  all: (req, res) => {
    Role
    .find({})
    .populate('owner members', 'username -_id')
    .sort({ createdAt: -1 })
    .exec((err, roles) => {
      if (err) {
        res.status(400).send({ error: 'Could not fetch roles.' });
      } else if (roles.length === 0) {
        res.status(404).send({ error: 'No roles to retrieve.' });
      } else {
        res.status(200).send(roles);
      }
    });
  },
};
