const _repo = require("../repository/user.repository");
const bcrypt = require("bcrypt");

async function getUsers(req, res) {
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
  const { body } = req;

  try {
    var existentUser = await _repo.getUserByEmail(body.email);
  } catch (error) {
    return res.status(400).send(error);
  }

  if (existentUser.length) {
    return res.status(400).send("Email is already in use.");
  }

  const SALT_ROUNDS = 10;

  bcrypt.hash(body.password, SALT_ROUNDS, async (error, hash) => {
    if (error) {
      return res.status(400);
    }

    const newUser = body;
    newUser.password = hash;

    try {
      var result = await _repo.createUser(newUser);
    } catch (error) {
      return res.status(400).send(error);
    }

    return res.status(200);
  });
}

async function logIn(req, res) {
  const { body } = req;

  try {
    var user = await _repo.getUserByEmail(body.email);
  } catch (error) {
    console.log({
      error,
    });
    res.status(400).send(error);
  }

  if (!user.length) {
    return res.status(400).send("Email or Password is incorrect");
  }

  user = user[0];

  bcrypt.compare(body.password, user.password, (error, result) => {
    if (error || !result) {
      res.status(400).send("Email or Password is incorrect");
    }

    // TODO: send JWT here
    res.status(200);
  });
}

module.exports = {
  getUsers,
  signUp,
  logIn
};
