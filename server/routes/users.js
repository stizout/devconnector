// Authentication Routes
const express = require('express');
const router = express.Router();

// @desc tests the route
// @access public
router.get('/test', (req, res) => {
  res.json({msg: "Users Works"})
});

module.exports = router