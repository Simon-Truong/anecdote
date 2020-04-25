'use strict';

const express = require('express');
const validation = require('../middleware/validation');
const passport = require('../middleware/passport');
const _service = require('../service/user.service');

const router = express.Router();

router.get('/users', async (req, res) => {
  await _service.getUsers(req, res);
});

router.post('/signup', validation.forSignUp, async (req, res) => {
  await _service.signUp(req, res);
});

router.post('/login', [validation.forLogin, passport.authenticate], async (req, res) => {
  await _service.logIn(req, res);
});

router.post('/verify', validation.forVerification, async (req, res) => {
  await _service.verify(req, res);
});

module.exports = router;
