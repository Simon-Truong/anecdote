'use strict';

const _repo = require('../repository/schedule.repository');
const moment = require('moment');

class ScheduleService {
  async getSchedules(req, res) {
    const {
      query: { d: monthYear, u: selectedUserId },
    } = req;

    const date = moment.utc(monthYear);

    if (!date.isValid()) {
      return res.status(400).send('Month of year is invalid');
    }

    const timeFrom = date.format();
    const timeTo = date.add(1, 'months').format();

    try {
      var schedules = await _repo.getSchedules(selectedUserId, timeFrom, timeTo);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    const formattedSchedules = schedules.map(({ time_from }) => time_from.format('YYYY-MM-DD'));

    const uniqueSchedules = [...new Set(formattedSchedules)];

    return res.status(200).json(uniqueSchedules);
  }

  async getDetailSchedules(req, res) {
    const {
      query: { f: timeFrom, t: timeTo, u: selectedUserId },
    } = req;

    const newTimeTo = moment.utc(timeTo, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');

    try {
      var detailSchedules = await _repo.getDetailSchedules(selectedUserId, timeFrom, newTimeTo);
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }

    var formattedDetailSchedules = detailSchedules.map((schedule) => {
      return {
        start: schedule.time_from.format('YYYY-MM-DD HH:mm'),
        end: schedule.time_to.format('YYYY-MM-DD HH:mm'),
      };
    });

    return res.status(200).json(formattedDetailSchedules);
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

    return res.status(200).send('Schedule successfully submitted');
  }
}

module.exports = new ScheduleService();
