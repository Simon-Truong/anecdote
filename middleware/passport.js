'use strict';
const passport = require('passport');
class PassportMiddleware {
  authenticate(req, res, next) {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      'use strict';
      if (error) {
        res.status(500).send(error);
      }

      if (!user) {
        res.status(400).send(info.message);
      }

      req.userId = user.id;

      next();
    })(req, res);
  }
}

module.exports = new PassportMiddleware();
