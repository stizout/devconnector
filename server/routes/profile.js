// Creating the user profile

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
const Profile = require('../models/Profile');
const User = require('../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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

// @desc get all of the profiles
// @access public

router.get('/all', (req, res) => {
  Profile.find().populate('user', 'name').then(profiles => {
    if(!profiles) return res.json({msg: 'There are no profiles'})
    res.json(profiles)
  }).catch(err => console.log('error with /all route', err))
})

// @desc get profile by handle
// @access public

router.get('/handle/:handle', (req, res) => {
  const errors = {}
  Profile.findOne({handle: req.params.handle}).populate('user', 'name').then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors)
    }
    res.json(profile);
  }).catch(err => res.status(404).json(err))
})

// @desc get profile by user_id
// @access public

router.get('/user/:user_id', (req, res) => {
  const errors = {}
  Profile.findOne({user: req.params.user_id}).populate('user', 'name').then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors)
    }
    res.json(profile);
  }).catch(err => res.status(404).json(errors))
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
        res.json(profile);
      })
    } else {
    // this is the create!
    Profile.findOne({handle: profileFields.handle}).then(profile => {
      if(profile) {
        errors.handle = 'That handle already exists'
        res.status(400).json(errors);
      }
      //  Save profile
      new Profile(profileFields).save().then(profile => res.json(profile));
    });
    }
  });
});

// @desc add education to the profile
// @access private

router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  const { school, degree, fieldofstudy, from, to, current, description } = req.body
  Profile.findOne({user: req.user.id}).then(profile => {
    let newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }
    // add to experience array
    profile.education.unshift(newEdu);
    profile.save().then(profile => {
      res.json(profile)
    });
  });
});

// @desc add experience to the profile
// @access private


router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }
  
  const { title, company, location, from, to, current, description } = req.body
  Profile.findOne({user: req.user.id}).then(profile => {
    let newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
    // add to experience array
    profile.experience.unshift(newExp);
    profile.save().then(profile => {
      res.json(profile)
    })
  })
})

// @desc delete experience
// @access private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id}).then(profile => {
    let index = profile.experience.map((item) => item.id).indexOf(req.params.exp_id)

    profile.experience.splice(index, 1);
    profile.save().then(profile => {
      res.json(profile);
    }).catch(err => console.log('error with delete experience', err))
  })
})

// @desc delete education
// @access private

router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id}).then(profile => {
    let index = profile.education.map((item) => item.id).indexOf(req.params.edu_id)

    profile.education.splice(index, 1);
    profile.save().then(profile => {
      res.json(profile);
    }).catch(err => console.log('error with delete experience', err));
  });
});

// @desc delete user and profile from database!
// @access private

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndRemove({user: req.user.id}).then(() => {
    User.findOneAndRemove({_id: req.user.id}).then(() => {
      res.json({msg: 'Profile and User has been deleted.'});
    });
  });
});


module.exports = router