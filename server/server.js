const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/users');
const profile = require('./routes/profile');
const posts = require('./routes/posts');

const app = express();

// Here is my DB Config
const db = require('../config/keys').mongoURI

// Connect to MongoDB using mongoose

mongoose.connect(db).then(() => {
  console.log('MongoDB Connected')
}).catch(err => console.log('error with connecting to mongoDB', err))

app.get('/', (req, res) => {
  res.json('Hello World')
})

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/post', posts)

const port = process.env.PORT || 4000

app.listen(port, () => console.log('Server Started MERN STACK!'));