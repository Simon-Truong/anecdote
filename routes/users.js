'use strict';

const express = require('express');
const validation = require('../middleware/validation');
const passport = require('../middleware/authentication');
const lowerCase = require('../middleware/lowercase');
const _userService = require('../service/user.service');

const router = express.Router();

router.get('/users', lowerCase.forSearch, async (req, res) => {
  await _userService.getUsers(req, res);
});

router.post('/signup', [validation.forSignUp, lowerCase.forSignUp], async (req, res) => {
  await _userService.signUp(req, res);
});

router.post('/login', [validation.forLogin, lowerCase.forLogin, passport.authenticate], async (req, res) => {
  await _userService.logIn(req, res);
});

router.post('/verify', validation.forVerification, async (req, res) => {
  await _userService.verify(req, res);
});

router.post('/resendCode', [validation.forResendCode, lowerCase.forResendCode], async (req, res) => {
  await _userService.resendCode(req, res);
});

router.post('/requestResetPassword', [validation.forRequestResetPassword, lowerCase.forRequestResetPassword], async (req, res) => {
  await _userService.requestResetPassword(req, res);
});

module.exports = router;
