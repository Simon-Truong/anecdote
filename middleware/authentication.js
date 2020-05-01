'use strict';
const passport = require('passport');
class PassportMiddleware {
  authenticate(req, res, next) {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error) {
        return res.status(500).send(error);
      }

      if (!user) {
        return res.status(400).send(info.message);
      }

      if (!user.verified) {
        return res.status(401).send('Email is not verified, resend code?');
      }

      req.userId = user.id;

      next();
    })(req, res);
  }
}

module.exports = new PassportMiddleware();
