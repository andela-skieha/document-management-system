const User = require('../models/user');

module.exports = {
  create: (req, res) => {
    const user = new User();
    user.username = req.body.username;
    user.name = { first: req.body.first, last: req.body.last };
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(409).send({ message: 'Duplicate user entry' });
        } else {
          res.status(400).send({ message: 'Error creating user' });
        }
      } else {
        res.status(201).send({ message: 'User created successfully' });
      }
    });
  },

  all: (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.send({ message: 'Could not fetch users.' });
      } else {
        res.json(users);
      }
    });
  },

  find: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        res.send({ message: 'Could not fetch user.' });
      } else {
        res.json(user);
      }
    });
  },
};
