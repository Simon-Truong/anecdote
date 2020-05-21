'use strict';

const express = require('express');
const { scheduleValidation } = require('../middleware/validation/index');
const passport = require('../middleware/authentication');
const _userService = require('../service/user.service');

const router = express.Router();

router.post('/schedule', scheduleValidation.forCreate, (req, res) => {
  console.log(req.body);
});

module.exports = router;
