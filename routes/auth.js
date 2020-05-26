'use strict';

const express = require('express');

const { userValidation } = require('../middleware/validation/index');
const passport = require('../middleware/authentication');
const lowerCase = require('../middleware/lowercase');
const _userService = require('../service/user.service');

const router = express.Router();

router.post('/login', [userValidation.forLogin, lowerCase.forLogin, passport.authenticateForLogin], async (req, res) => {
    await _userService.logIn(req, res);
  });

module.exports = router;
