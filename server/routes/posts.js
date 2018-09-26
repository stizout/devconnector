//  user post routes


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// models
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const validatePostInput = require('../../validation/post');

// @desc tests the route
// @access public
router.get('/test', (req, res) => {
  res.json({msg: "Post Works"})
});

// @desc get all posts
// @access public

router.get('/', (req, res) => {
  Post.find().sort({date: -1}).then(posts => {
    res.json(posts)
  }).catch(err => console.log('error with getting posts', err));
});

// @desc get single post
// @access public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(post => {
    res.json(post)
  }).catch(err => console.log('error with getting post', err));
});

// @desc create posts
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid } = validatePostInput(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  const { text, name } = req.body
  const newPost = new Post({
    text,
    name,
    user: req.user.id
  });
  newPost.save().then(post => {
    res.json(post)
  })
});

// @desc delete single post
// @access private

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.findById(req.params.id).then(post => {
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'You are not authorized'});
    }
    post.remove().then(() => {
      res.json({msg: "Post has been deleted"});
    }).catch(err => console.log('error with post.remove', err));
  });
});

// @desc Like post
// @access private

router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.findById(req.params.id).then(post => {
    console.log(post)
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({msg: 'You have already liked this post'})
    }
    post.likes.unshift({user: req.user.id});
    post.save().then(post => {
      res.json(post)
    })
  });
});

// @desc unlike post
// @access private

router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.findById(req.params.id).then(post => {
    console.log(post)
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({msg: "You haven't liked this post"})
    }
    const index = post.likes.map((like) => like.user.toString).indexOf(req.user.id)
    post.likes.splice(index, 1);
    post.save().then(post => {
      res.json(post)
    });
  });
});


// @desc comment on a post
// @access private

router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid } = validatePostInput(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  Post.findById(req.params.id).then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      user: req.user.id,
    }
    post.comments.unshift(newComment);
    post.save().then(post => {
      res.json(post);
    }).catch(err => console.log('error with posting comment', err));
  });
});

// @desc delete a comment
// @access private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {

  Post.findById(req.params.id).then(post => {
    if(post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
      return res.status(404).json({msg: "Comment not found"})
    }
    const index = post.comments.map((comment) => comment._id.toString()).indexOf(req.params.comment_id);
    post.comments.splice(index, 1);
    post.save().then(post => {
      res.json(post);
    }).catch(err => console.log('error with posting comment', err));
  });
});

module.exports = router