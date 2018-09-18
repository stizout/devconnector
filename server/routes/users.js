// Authentication Routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/registration');
const validateLoginInput = require('../../validation/login');

// @desc tests the route
// @access public
router.get('/test', (req, res) => {
  res.json({msg: "Users Works"})
});

// @desc register a user
// @access public
router.post('/register', (req, res) => {
  const { name, email, password, date } = req.body
  const { errors, isValid } = validateRegisterInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if(user) {
      return res.status(400).json({email: 'Email already exists'});
    } else {
      const newUser = new User({
        name,
        email,
        password,
        date
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) {
            throw err
          } else {
            newUser.password = hash;
            newUser.save().then(user => {
              res.json(user);
            }).catch(err => console.log('error with bcrypt hash', err));
          }
        });
      });
    }
  });
});

// @desc login user or return jwt token
// @access public

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const { errors, isValid } = validateLoginInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }


  User.findOne({email}).then((user) => {
    if(!user) {
      return res.status(404).json({email: 'User not found'})
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if(isMatch) {
        let payload = {
          id: user.id,
          name: user.name,
        }
        jwt.sign(payload, keys.payloadKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          })
        });
      } else {
        return res.status(400).json({password: 'Password incorrect'})
      }
    });
  });
})


// @desc login user or return jwt token
// @access must be logged in

router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
})

module.exports = router