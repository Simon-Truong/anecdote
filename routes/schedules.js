'use strict';

const express = require('express');
const { scheduleValidation } = require('../middleware/validation/index');
const passport = require('../middleware/authentication');
const _scheduleService = require('../service/schedule.service');

const router = express.Router();

router.get('/schedule', passport.authenticateJWT, async (req, res) => {
  await _scheduleService.getSchedules(req, res);
});

router.get('/detailSchedule', passport.authenticateJWT, async (req, res) => {
  await _scheduleService.getDetailSchedules(req, res);
});

router.post('/schedule', [scheduleValidation.forCreate, passport.authenticateJWT], async (req, res) => {
  await _scheduleService.createSchedule(req, res);
});

module.exports = router;
