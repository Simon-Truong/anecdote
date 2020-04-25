'use strict';
const _userRepo = require('../repository/user.repository');
const _verifyTokensService = require('./verify-tokens.service');
const _emailService = require('./email.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function getUsers(req, res) {
  'use strict';
  _emailService.sendEmail('1234567890', 'me.simon_@hotmail.com', 'simon', 'sadfgh'); // TODO: remove this
  return;
  const { q } = req.query;

  try {
    if (q) {
      var result = await _userRepo.searchUsers(q);
    } else {
      var result = await _userRepo.getAllUsers();
    }

    res.send(result);
  } catch (error) {
    console.log({
      error,
    });

    res.status(400).send(error);
  }
}

async function signUp(req, res) {
  'use strict';
  const { body } = req;

  try {
    var existentUser = await _userRepo.getUserByEmail(body.email);
  } catch (error) {
    console.log({ error });
    return res.status(500).send(error);
  }

  if (existentUser) {
    console.log('Email is already in user.');
    return res.status(400).send('Email is already in use.');
  }

  const SALT_ROUNDS = 10;

  bcrypt.hash(body.password, SALT_ROUNDS, async (error, hash) => {
    if (error) {
      console.log({ error });
      return res.status(500);
    }

    const newUser = body;
    newUser.password = hash;

    try {
      const newUserId = await _userRepo.createUser(newUser);

      const secretCode = await _verifyTokensService.createVerifyToken(newUserId);

      await _emailService.sendEmail(newUserId, newUser.email, newUser.firstName, secretCode);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    return res.status(200);
  });
}

async function logIn(req, res) {
  'use strict';
  const { userId } = req;

  const SECONDS_IN_A_DAY = 86400;

  const token = jwt.sign(
    {
      userId: userId,
      exp: Math.floor(Date.now() / 1000) + SECONDS_IN_A_DAY,
    },
    process.env.JWT_SECRET
  );

  res.status(200).send({ token });
}

module.exports = {
  getUsers,
  signUp,
  logIn,
};
