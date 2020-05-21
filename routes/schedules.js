'use strict';

const express = require('express');
const validation = require('../middleware/validation');
const passport = require('../middleware/authentication');
const lowerCase = require('../middleware/lowercase');
const _userService = require('../service/user.service');

const router = express.Router();

router.post('/schedule', (req, res) => {
  console.log(req.body);
});

module.exports = router;
