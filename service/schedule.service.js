'use strict';

const _repo = require('../repository/schedule.repository');

class ScheduleService {
  async createSchedule(req, res) {
    const { body } = req;

    try {
      const conflict = await _repo.validateSchedule(body);

      if (conflict) {
        return res.status(400).send('New schedule is coflicting with existing schedules');
      }

      await _repo.createSchedule(body);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    return res.status(200).send('Scheduled successfully');
  }
}

module.exports = new ScheduleService();
