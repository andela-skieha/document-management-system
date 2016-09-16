/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

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

  findOne: (req, res) => {
    Role
    .findById(req.params.id)
    .populate('owner members', 'username -_id')
    .exec((err, role) => {
      if (err || role === null) {
        res.status(404).send({ error: 'Role not found.' });
      } else {
        res.status(200).send(role);
      }
    });
  },

  updateOne: (req, res) => {
    Role.findById(req.params.id, (err, role) => {
      if (err || role === null) {
        res.status(404).send({ error: 'Role not found.' });
        return;
      }

      if (req.body.title) role.title = req.body.title;

      if (req.body.addMembers) {
        req.body.addMembers.forEach((member) => {
          if (role.members.indexOf(member) === -1) {
            role.members.push(member);
          }
        });
      }

      if (req.body.removeMembers) {
        req.body.removeMembers.forEach((member) => {
          if (role.members.indexOf(member) !== -1) {
            role.members.splice(role.members.indexOf(member), 1);
          }
        });
      }

      role.save((error) => {
        if (error) {
          if (error.code === 11000) {
            res.status(409).send({ error: 'Duplicate entry.' });
            return;
          }
        } else if (Object.keys(req.body).length === 0) {
          res.status(400).send({ error: 'Nothing to update.' });
        } else {
          res.status(200).send({ message: 'Role updated successfully.' });
        }
      });
    });
  },
};
