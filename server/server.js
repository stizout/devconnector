const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/users');
const profile = require('./routes/profile');
const posts = require('./routes/posts');

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Here is my DB Config
const db = require('../config/keys').mongoURI

// Connect to MongoDB using mongoose

mongoose.connect(db).then(() => {
  console.log('MongoDB Connected')
}).catch(err => console.log('error with connecting to mongoDB', err))

// Passport Middleware
app.use(passport.initialize());
require('../config/passport')(passport)

 // Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 4000

app.listen(port, () => console.log('Server Started MERN STACK!'));