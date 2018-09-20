// Creating the user profile

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
const Profile = require('../models/Profile');
const User = require('../models/User');
const validateProfileInput = require('../../validation/profile');

// @desc tests the route
// @access public
router.get('/test', (req, res) => {
  res.json({msg: "Profile Works"})
});

// @desc get the current user profile
// @access private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};
  // user is from the profile model, comparing it to the req.user.id to find a match
  Profile.findOne({user: req.user.id}).populate('user', 'name').then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)
  }).catch(err => console.log('error with profile route', err))
})

// @desc create or edit user profile
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  let profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle
  if(req.body.company) profileFields.company = req.body.company
  if(req.body.website) profileFields.website = req.body.website
  if(req.body.location) profileFields.location = req.body.location
  if(req.body.status) profileFields.status = req.body.status
  if(req.body.bio) profileFields.bio = req.body.bio
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram

  Profile.findOne({user: req.user.id}).then(profile => {
    if(profile) {
      // This is now an update!
      Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields}, 
        {new: true}).then(profile => {
        res.json(profile)
      })
    } else {
    // this is the create!
    Profile.findOne({handle: profileFields.handle}).then(profile => {
      if(profile) {
        errors.handle = 'That handle already exists'
        res.status(400).json(errors)
      }
      //  Save profile
      new Profile(profileFields).save().then(profile => res.json(profile))
    })  
    }
  })
})

module.exports = router