'use strict';

const pgp = require('pg-promise');

const BaseRespository = require('./base.repository');

class ScheduleRepository extends BaseRespository {
  constructor() {
    super(process.env.SCHEDULES_TABLE);
  }

  async createSchedule(newSchedule) {
    const { userId, selectedUserId, from, to, lat, lng, comments } = newSchedule;

    const pgQuery = `
        INSERT INTO ${this._table}
        (user_id, selected_user_id, time_from, time_to, lat, lng, comments)
        VALUES($1, $2, $3, $4, $5, $6, $7)
    `;

    await this._pool.query(pgQuery, [userId, selectedUserId, from, to, lat, lng, comments]);
  }
}

module.exports = new ScheduleRepository();
