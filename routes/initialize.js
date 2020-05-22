'use strict';

const express = require('express');
const router = express.Router();
const _initializeService = require('../service/initialize.service');

router.post('/initialize', async (req, res) => {
  await _initializeService.initialize(req, res);
});

module.exports = router;
