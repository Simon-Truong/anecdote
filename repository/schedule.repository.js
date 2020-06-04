'use strict';

const pgp = require('pg-promise');

const BaseRespository = require('./base.repository');

class ScheduleRepository extends BaseRespository {
  constructor() {
    super(process.env.SCHEDULES_TABLE);

    this._usersTable = process.env.USERS_TABLE;
  }

  async getSchedules(selectedUserId, timeFrom, timeTo) {
    const pgQuery = `
        SELECT time_from 
        FROM ${this._table}
        WHERE 
          selected_user_id = $1 AND
          time_from > $2 AND
          time_to < $3
    `;

    return (await this._pool.query(pgQuery, [selectedUserId, timeFrom, timeTo])).rows;
  }

  async getDetailSchedules(selectedUserId, timeFrom, timeTo) {
    const pgQuery = `
      SELECT time_from, time_to
      FROM ${this._table} 
      WHERE
        selected_user_id = $1 AND
        time_from > $2 AND
        time_to < $3
    `;

    return (await this._pool.query(pgQuery, [selectedUserId, timeFrom, timeTo])).rows;
  }

  // Personal calendar
  // const pgQuery = `
  //     SELECT time_from, time_to, lat, lng, comments, first_name, surname
  //     FROM ${this._table} INNER JOIN ${this._usersTable} 
  //     ON (${this._table}.selected_user_id = ${this._usersTable}.id)
  //     WHERE
  //       selected_user_id = $1 AND
  //       time_from > $2 AND
  //       time_to < $3
  //   `;


  async createSchedule(newSchedule) {
    const { userId, selectedUserId, from, to, lat, lng, comments } = newSchedule;

    const pgQuery = `
        INSERT INTO ${this._table}
        (user_id, selected_user_id, time_from, time_to, lat, lng, comments)
        VALUES($1, $2, $3, $4, $5, $6, $7)
    `;

    await this._pool.query(pgQuery, [userId, selectedUserId, from, to, lat, lng, comments]);
  }

  async validateSchedule(newSchedule) {
    const { from, to } = newSchedule;

    const pgQuery = `
      SELECT id
      FROM ${this._table}
      WHERE                
        time_from < $2 AND  time_from >= $1 OR
        time_to > $1 AND time_to <= $2 OR
        time_from >= $1 AND time_to <= $2 OR
        time_from <= $1 AND time_to >= $2
    `;

    const response = (await this._pool.query(pgQuery, [from, to])).rows;

    return this.handlePgResponse(response);
  }
}

module.exports = new ScheduleRepository();
