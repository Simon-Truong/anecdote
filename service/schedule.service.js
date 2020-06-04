'use strict';

const _repo = require('../repository/schedule.repository');
const moment = require('moment');

class ScheduleService {
  async getSchedules(req, res) {
    const {
      query: { d: monthYear },
    } = req;

    const date = moment.utc(monthYear);

    if (!date.isValid()) {
      return res.status(400).send('Month of year is invalid');
    }

    const timeFrom = date.format();
    const timeTo = date.add(1, 'months').format();

    try {
      var schedules = await _repo.getSchedules(timeFrom, timeTo);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    const formattedSchedules = schedules.map(({ time_from }) => time_from.format('YYYY-MM-DD'));

    const uniqueSchedules = [...new Set(formattedSchedules)];

    return res.status(200).json(uniqueSchedules);
  }

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
