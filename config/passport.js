const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.payloadKey

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id).then((user) => {
      console.log('this time i was hit')
      if(user) {
        console.log('I was just hit')
        return done(null, user);
      }
      return done(null, false);
    }).catch(err => console.log('error with passport.use', err));
  }));
}