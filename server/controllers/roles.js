/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */

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
          res.status(409).send({ error: 'Duplicate entry: Title already exists.' });
        } else if (!req.body.title) {
          res.status(400).send({ error: `Error creating role: ${err.errors.title.message}` });
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
    if (req.decoded.role === 'admin') {
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
    } else {
      res.status(403).send({ error: 'You are not authorized to access this resource.' });
    }
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
    Role
      .findById(req.params.id, (err, role) => {
        if (err || role === null) {
          res.status(404).send({ error: 'Role not found.' });
        } else if (req.decoded._id == role.owner) {
          if (Object.keys(req.body).length === 0) {
            res.status(400).send({ error: 'Nothing to update.' });
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
            } else {
              res.status(200).send({
                message: 'Role updated successfully.',
                role,
              });
            }
          });
        } else {
          res.status(403).send({ error: 'Cannot edit role you did not create.' });
        }
      });
  },

  deleteOne: (req, res) => {
    Role
      .findById(req.params.id, (err, role) => {
        if (err || role === null) {
          res.status(404).send({ error: 'Role not found.' });
        } else if (req.decoded._id == role.owner) {
          role.remove((error) => {
            if (error) {
              res.status(400).send({ error: 'Could not delete role.' });
            } else {
              res.status(200).send({ message: 'Role deleted successfully.' });
            }
          });
        } else {
          res.status(403).send({ error: 'Cannot delete role you did not create.' });
        }
      });
  },
};
