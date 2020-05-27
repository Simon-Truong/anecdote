'use strict';

const BaseRepository = require('./base.repository');

class SessionRepository extends BaseRepository {
  constructor() {
    super(process.env.SESSIONS_TABLE);
  }

  async createSession(userId) {
    const pgQuery = `
        INSERT INTO ${this._table} (user_id)
        VALUES ($1)
        RETURNING refresh_token
    `;

    const response = await this._pool.query(pgQuery, [userId]);

    return response.rows[0].refresh_token;
  }
}

module.exports = new SessionRepository();
