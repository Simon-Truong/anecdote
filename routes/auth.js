'use strict';

const express = require('express');

const { userValidation } = require('../middleware/validation/index');
const passport = require('../middleware/authentication');
const lowerCase = require('../middleware/lowercase');
const _authService = require('../service/auth.service');

const router = express.Router();

router.post('/login', [userValidation.forLogin, lowerCase.forLogin, passport.authenticateForLogin], async (req, res) => {
    await _authService.logIn(req, res);
});

router.get('/refreshToken/:id', async (req, res) => {
    await _authService.refreshSession(req, res);
});

module.exports = router;
