'use strict';

const _repo = require('../repository/user.repository');
const _verificationTokenService = require('./verification-token.service');
const _emailService = require('./email.service');
const _passwordTokenService = require('./password-token.service');
const bcrypt = require('bcrypt');
const moment = require('moment');

class UserService {
  constructor() {
    this.SALT_ROUNDS = 10;
  }

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

  async getUserById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('User id not provided');
    }

    try {
      var user = await _repo.getUserById(id);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!user) {
      return res.status(400).send('User does not exist');
    }

    return res.status(200).json(user);
  }

  async getUserByIdRaw(id) {
    return await _repo.getUserByIdRaw(id);
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

    bcrypt.hash(body.password, this.SALT_ROUNDS, async (error, hash) => {
      if (error) {
        console.log({ error });
        return res.status(500).send(error);
      }

      const newUser = body;
      newUser.password = hash;

      try {
        const newUserId = await _repo.createUser(newUser);

        const secretCode = await _verificationTokenService.createVerificationToken(newUserId);

        _emailService.sendVerificationEmail(newUserId, newUser.email, newUser.firstName, secretCode);
      } catch (error) {
        console.log({ error });
        return res.status(500).send(error);
      }

      return res.status(200).send('You have sucessfully signed up, please verify your email');
    });
  }

  async verify(req, res) {
    const { userId, secretCode } = req.body;

    try {
      var verificationToken = await _verificationTokenService.getVerificationToken(userId, secretCode);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!verificationToken) {
      return res.status(400).send('Code is incorrect');
    }

    const { expiry } = verificationToken;

    if (!moment.utc().isBefore(expiry)) {
      return res.status(400).send('Code has expired, please resend code');
    }

    try {
      await _repo.verifyUserStatus(userId);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error)
    }

    return res.status(200).send('Successfully verified');
  }

  async resendCode(req, res) {
    const { email: requestEmail, userId } = req.body;

    try {
      if (requestEmail) {
        var response = await _repo.findVerificationTokenIdByEmail(requestEmail);
      }

      if (userId) {
        var response = await _repo.findVerificationTokenByUserId(userId);
      }
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!response && requestEmail) {
      return res.status(400).send('Email does not exist');
    }

    if (!response && userId) {
      return res.status(400).send('User does not exist');
    }

    const { verificationtokenid, userid, first_name, verified, email } = response;

    if (verified) {
      return res.status(400).send('Email already verified');
    }

    try {
      const newSecret = await _verificationTokenService.updateVerificationToken(verificationtokenid);
      _emailService.sendVerificationEmail(userid, email, first_name, newSecret);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    return res.status(200).send('Successfully sent new code to email');
  }

  async requestResetPassword(req, res) {
    const { email } = req.body;

    try {
      var existentUser = await _repo.getUserByEmail(email);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!existentUser) {
      return res.status(400).send('Email does not exist');
    }

    const userId = existentUser.id;

    try {
      const existentPasswordToken = await _passwordTokenService.getPasswordTokenbyUserId(userId);

      if (existentPasswordToken) {
        var secretCode = await _passwordTokenService.updatePasswordToken(existentPasswordToken.id);
      } else {
        var secretCode = await _passwordTokenService.createPasswordToken(userId);
      }
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    _emailService.sendResetPasswordEmail(existentUser.id, existentUser.email, existentUser.first_name, secretCode);

    res.status(200).send('Reset password email sent');
  }

  async resetPassword(req, res) {
    const { userId, secretCode, password } = req.body;

    try {
      var existentPasswordToken = await _passwordTokenService.getPasswordToken(userId, secretCode);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    if (!existentPasswordToken) {
      return res.status(400).send('Code is incorrect');
    }

    if (!moment.utc().isBefore(existentPasswordToken.expiry)) {
      return res.status(400).send('Code has expired, reset your password again?');
    }

    bcrypt.hash(password, this.SALT_ROUNDS, async (error, hash) => {
      if (error) {
        console.log({ error });
        return res.status(500).send(error);
      }

      try {
        await _repo.updateUserPassword(existentPasswordToken.user_id, hash);
      } catch (error) {
        console.log({ error });
        return res.status(500).send(error);
      }

      return res.status(200).send('You have sucessfully resetted your password');
    });
  }
}

module.exports = new UserService();
