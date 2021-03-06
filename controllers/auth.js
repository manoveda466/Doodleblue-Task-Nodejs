const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   res.status(422).json({ message: 'Validation failed'});
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const gender = req.body.gender;
  const dob = new Date(req.body.dob);
  dob.setDate(dob.getDate() + 1)
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
        dob: dob,
        gender: gender
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created successfully!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.status(401).json({ message: 'Invalid email'});
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        res.status(401).json({ message: 'Wrong password'});
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'scerettoken',
        { expiresIn: '2h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
