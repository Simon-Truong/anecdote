'use strict';

const BaseRepository = require('./base.repository');

class SessionRepository extends BaseRepository {
  constructor() {
    super(process.env.SESSIONS_TABLE);
  }

  async getSession(userId) {
    const pgQuery = `
      SELECT id
      FROM ${this._table}
      WHERE user_id = $1
    `;

    const response = await this._pool.query(pgQuery, [userId]);

    return response.rows.length;
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

  async updateSessionById(userId) {
    const pgQuery = `
      UPDATE ${this._table}
      SET refresh_token = DEFAULT
      WHERE user_id = $1
      RETURNING refresh_token
    `;

    const response = await this._pool.query(pgQuery, [userId]);

    return response.rows[0].refresh_token;
  }

  async updateSessionByRefreshToken(refreshToken) {
    const pgQuery = `
      UPDATE ${this._table}
      SET refresh_token = DEFAULT
      WHERE refresh_token = $1
      RETURNING refresh_token, user_id
    `;

    const response = await this._pool.query(pgQuery, [refreshToken]);

    return response.rows[0];
  }

}

module.exports = new SessionRepository();
