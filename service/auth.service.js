'use strict'

const _sessionService = require('./session.service');
const jwt = require('jsonwebtoken');

class AuthService {
    async logIn(req, res) {
        const { userId, user } = req;

        try {
            var refreshToken = await _sessionService.createSession(userId);
        } catch (error) {
            console.log({ error });
            return res.status(500).send(500);
        }

        const MILLISECONDS_IN_A_DAY = 86400000;
        const ACCESS_TOKEN_EXPIRATION_IN_MINUTES = 15;

        const accessToken = jwt.sign(
            {
            userId: userId,
            expiresIn: ACCESS_TOKEN_EXPIRATION_IN_MINUTES + 'm',
            },
            process.env.JWT_SECRET
        );

        res.cookie('refresh_token', refreshToken, { httpOnly: true, signed: true, maxAge: MILLISECONDS_IN_A_DAY });

        return res.status(200).json({ token: accessToken, accessTokenExpInMins: 15, user });
    }

    async refreshSession(req, res) {
        console.log(req);
    }
}

module.exports = new AuthService();