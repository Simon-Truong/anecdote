'use strict';
const _repo = require('../repository/user.repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function getUsers(req, res) {
  'use strict';
  const { q } = req.query;

  try {
    if (q) {
      var result = await _repo.searchUsers(q);
    } else {
      var result = await _repo.getAllUsers();
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
    var existentUser = await _repo.getUserByEmail(body.email);
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
      var newUserId = await _repo.createUser(newUser);

      await _repo.createVerifyToken(newUserId);
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
