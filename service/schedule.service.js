'use strict';

const _repo = require('../repository/schedule.repository');
const jwt = require('jsonwebtoken');

class ScheduleService {
  async createSchedule(req, res) {
    try {
      await _repo.createSchedule(req.body);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    return res.status(200).send('Scheduled successfully');
  }
}

module.exports = new ScheduleService();
