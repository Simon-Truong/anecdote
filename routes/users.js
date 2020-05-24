'use strict';

const express = require('express');
const { userValidation } = require('../middleware/validation/index');
const passport = require('../middleware/authentication');
const lowerCase = require('../middleware/lowercase');
const _userService = require('../service/user.service');

const router = express.Router();

router.get('/users', lowerCase.forSearch, async (req, res) => {
  await _userService.getUsers(req, res);
});

router.get('/user/:id', async (req, res) => {
  await _userService.getUserById(req, res);
});

router.post('/signup', [userValidation.forSignUp, lowerCase.forSignUp], async (req, res) => {
  await _userService.signUp(req, res);
});

router.post('/login', [userValidation.forLogin, lowerCase.forLogin, passport.authenticateForLogin], async (req, res) => {
  await _userService.logIn(req, res);
});

router.post('/verify', userValidation.forVerification, async (req, res) => {
  await _userService.verify(req, res);
});

router.post('/resendCode', [userValidation.forResendCode, lowerCase.forResendCode], async (req, res) => {
  await _userService.resendCode(req, res);
});

router.post('/requestResetPassword', [userValidation.forRequestResetPassword, lowerCase.forRequestResetPassword], async (req, res) => {
  await _userService.requestResetPassword(req, res);
});

router.post('/resetPassword', userValidation.forResetPassword, async (req, res) => {
  await _userService.resetPassword(req, res);
});

module.exports = router;
