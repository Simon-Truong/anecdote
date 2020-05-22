'use strict';

const express = require('express');
const router = express.Router();

router.get('/users', async (req, res) => {
  await _userService.getUsers(req, res);
});

module.exports = router;
