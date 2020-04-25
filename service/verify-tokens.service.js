const _repo = require('../repository/verify-tokens.repository');
const _userService = require('./user.service');
const moment = require('moment');

async function createVerifyToken(newUserId) {
  await _repo.createVerifyToken(newUserId);
}

async function verify(req, res) {
  'use strict';

  const { userId, secretCode } = req.body;

  try {
    var verifyToken = await _verifyTokensRepo.getSecretByUserId(userId);
  } catch (error) {
    console.log({ error });
    res.status(500).send(error);
  }

  if (!verifyToken) {
    return res.status(400);
  }

  if (!matchVerifyToken(secretCode, verifyToken)) {
    return res.status(400).send('Code has expired');
  }


}

function matchVerifyToken(secretCode, verifyToken) {
  if (secretCode === verifyToken.secret && moment(verifyToken.expiry).isBefore(moment().format())) {
    return true;
  }

  return false;
}

module.exports = {
  createVerifyToken,
  verify,
};
