'use strict';

const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

const bcrypt = require('bcrypt');
const _userService = require('../service/user.service');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      var user = await _userService.getUserByEmailForLogin(email);
    } catch (error) {
      console.log({ error });
      return done(error, false);
    }

    if (!user) {
      return done(null, false, { message: 'Email or Password is incorrect' });
    }

    bcrypt.compare(password, user.password, (error, result) => {
      if (error || !result) {
        return done(null, false, { message: 'Email or Password is incorrect' });
      }

      delete user.password;

      done(null, user, { message: 'Successfully logged in' });
    });
  })
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

passport.use(
  new JwtStrategy(opts, async ({ userId }, done) => {
    try {
      var user = await _userService.getUserByIdRaw(userId);
    } catch (error) {
      console.log({ error });
      return done(error, false);
    }

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    return done(null, user);
  })
);
