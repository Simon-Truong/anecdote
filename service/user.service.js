'use strict';

const _repo = require('../repository/user.repository');
const _verificationTokensService = require('./verify-tokens.service');
const _emailService = require('./email.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserService {
  async getUsers(req, res) {
    const { q } = req.query;

    try {
      if (q) {
        var result = await _repo.searchUsers(q);
      } else {
        var result = await _repo.getAllUsers();
      }

      return res.send(result);
    } catch (error) {
      console.log({
        error,
      });

      return res.status(400).send(error);
    }
  }

  async signUp(req, res) {
    const { body } = req;

    try {
      var existentUser = await _repo.getUserByEmail(body.email);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (existentUser) {
      console.log('Email is already in use');
      return res.status(400).send('Email is already in use');
    }

    const SALT_ROUNDS = 10;

    bcrypt.hash(body.password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        console.log({ error });
        return res.status(500).send(error);
      }

      const newUser = body;
      newUser.password = hash;

      try {
        const newUserId = await _repo.createUser(newUser);

        const secretCode = await _verificationTokensService.createVerificationToken(newUserId);

        await _emailService.sendEmail(newUserId, newUser.email, newUser.firstName, secretCode);
      } catch (error) {
        console.log({ error });
        return res.status(500).send(error);
      }

      return res.status(200).send('You have sucessfully signed up, please verify your email');
    });
  }

  async logIn(req, res) {
    const { userId } = req;

    const SECONDS_IN_A_DAY = 86400;

    const token = jwt.sign(
      {
        userId: userId,
        exp: Math.floor(Date.now() / 1000) + SECONDS_IN_A_DAY,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({ token });
  }

  async verify(req, res) {
    const { userId, secretCode } = req.body;

    try {
      var verificationToken = await _verificationTokensService.verifyUser(userId, secretCode);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!verificationToken) {
      return res.status(400).send('Code has expired or code is incorrect');
    }

    try {
      await _repo.verifyUserStatus(userId);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    return res.status(200).send('Successfully verified');
  }

  async resendCode(req, res) {
    const { email } = req.body;

    try {
      var response = await _repo.findVerificationTokenIdByEmail(email);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!response) {
      return res.status(400).send('Email does not exist');
    }

    const { verificationtokenid, userid, first_name, verified } = response;

    if (verified) {
      return res.status(400).send('Email already verified');
    }

    try {
      const newSecret = await _verificationTokensService.updateVerificationToken(verificationtokenid);
      await _emailService.sendEmail(userid, email, first_name, newSecret);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    return res.status(200).send('Successfully sent new code to email');
  }
}

module.exports = new UserService();
