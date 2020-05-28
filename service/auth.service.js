'use strict';

const _sessionService = require('./session.service');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this.MILLISECONDS_IN_A_DAY = 86400000;
    this.REFRESH_TOKEN_EXPIRATION_IN_MILLISECONDS = this.MILLISECONDS_IN_A_DAY * 7;
    this.ACCESS_TOKEN_EXPIRATION_IN_MINUTES = 15;
  }

  async logIn(req, res) {
    const { userId, user } = req;

    try {
      const existentSession = await _sessionService.getSession(userId);

      if (existentSession) {
        var refreshToken = await _sessionService.updateSession(userId);
      } else {
        var refreshToken = await _sessionService.createSession(userId);
      }
    } catch (error) {
      console.log({ error });
      return res.status(500).send(500);
    }

    const accessToken = jwt.sign(
      {
        userId: userId,
        expiresIn: this.ACCESS_TOKEN_EXPIRATION_IN_MINUTES + 'm',
      },
      process.env.JWT_SECRET
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, signed: true, maxAge: this.REFRESH_TOKEN_EXPIRATION_IN_MILLISECONDS });

    return res.status(200).json({ accessToken, accessTokenExpInMins: this.ACCESS_TOKEN_EXPIRATION_IN_MINUTES - 5, user });
  }

  async refreshSession(req, res) {
    const {
      signedCookies: { refreshToken },
    } = req;

    if (!refreshToken) {
      return res.status(401).send('Refresh token expired');
    }

    const {
      params: { id },
    } = req;

    try {
      var newRefreshToken = await _sessionService.updateSession(id);
    } catch (error) {
      console.log({ error });
      return res.send(500).send(error);
    }

    const newAccessToken = jwt.sign(
      {
        userId: id,
        expiresIn: this.ACCESS_TOKEN_EXPIRATION_IN_MINUTES + 'm',
      },
      process.env.JWT_SECRET
    );

    res.clearCookie('refreshToken');
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, signed: true, maxAge: this.REFRESH_TOKEN_EXPIRATION_IN_MILLISECONDS });

    return res.status(200).json({ accessToken: newAccessToken, accessTokenExpInMins: this.ACCESS_TOKEN_EXPIRATION_IN_MINUTES - 5 });
  }
}

module.exports = new AuthService();
