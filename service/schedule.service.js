'use strict';

const _repo = require('../repository/user.repository');
const jwt = require('jsonwebtoken');
const moment = require('moment');

class ScheduleService {
  async createSchedule(req, res) {
    console.log(req.body);
  }
}

module.exports = new ScheduleService();
