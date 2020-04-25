'use strict';

const { Pool } = require('pg');
const pgp = require('pg-promise');
const cryptoRandomString = require('crypto-random-string');
const moment = require('moment');
const uuid = require('uuid');

class VerifyTokensRepository {
  constructor() {
    this._connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

    this._pool = new Pool({
      connectionString: this._connectionString,
    });

    this._table = process.env.VERIFY_TOKENS_TABLE;
  }

  async createVerifyToken(newUserId) {
    const pgQuery = `
        INSERT INTO ${this._table}
        (id, userid, secret, expiry)
        VALUES ($1, $2, $3, $4)
      `;

    const secretCode = cryptoRandomString({ length: 10, type: 'base64' });

    await this._pool.query(pgQuery, [uuid.v4(), newUserId, secretCode, moment().add(1, 'h').utc()]);

    return secretCode;
  }

  async verifyUser(userId, secretCode) {
    const pgQuery = `
        SELECT id
        FROM ${this._table}
        WHERE 
          userid = $1 AND
          secret = $2 AND
          expiry >= timestamp '${moment.utc().format()}'
      `;

    const response = await (await this._pool.query(pgQuery, [userId, secretCode])).rows;

    if (!response.length) {
      return null;
    }

    return response[0];
  }
}

module.exports = new VerifyTokensRepository();
