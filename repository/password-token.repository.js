'use strict';

const pgp = require('pg-promise');

const BaseRepository = require('./base.repository');

class PasswordTokenRepository extends BaseRepository {
  constructor() {
    super(process.env.PASSWORD_TOKENS_TABLE);
  }

  async getPasswordTokenbyUserId(userId) {
    const pgQuery = `
            SELECT id 
            FROM ${this._table}
            WHERE user_id = $1
        `;

    const response = (await this._pool.query(pgQuery, [userId])).rows;

    return this.handlePgResponse(response);
  }

  async getPasswordToken(userId, secretCode) {
    const pgQuery = `
            SELECT user_id, expiry
            FROM ${this._table}
            WHERE user_id = $1 AND
            secret = $2
        `;

    const response = (await this._pool.query(pgQuery, [userId, secretCode])).rows;

    return this.handlePgResponse(reponse);
  }

  async createPasswordToken(userId) {
    const pgQuery = `
        INSERT INTO ${this._table}
        (user_id)
        VALUES ($1)
        RETURNING secret
    `;

    const result = await this._pool.query(pgQuery, [userId]);

    return result.rows[0].secret;
  }

  async updatePasswordToken(passwordTokenId) {
    const pgQuery = `
        UPDATE ${this._table}
        SET secret = DEFAULT, expiry = DEFAULT
        WHERE id = $1
        RETURNING secret
    `;

    const result = await this._pool.query(pgQuery, [passwordTokenId]);

    return result.rows[0].secret;
  }
}

module.exports = new PasswordTokenRepository();
