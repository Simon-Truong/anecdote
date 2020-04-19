'use strict';

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const _repo = require('../repository/user.repository');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    'use strict';
    try {
      var user = await _repo.getUserByEmail(email);
    } catch (error) {
      console.log({ error });
      done(error, false);
    }

    if (!user) {
      done(null, false, { message: 'Email or Password is incorrect' });
    }

    bcrypt.compare(password, user.password, (error, result) => {
      if (error || !result) {
        done(null, false, { message: 'Email or Password is incorrect' });
      }

      done(null, user, { message: 'Successfully logged in' });
    });
  })
);
