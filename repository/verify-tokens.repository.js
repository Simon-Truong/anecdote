'use strict';

const { Pool } = require('pg');
const pgp = require('pg-promise');
const cryptoRandomString = require('crypto-random-string');
const uuid = require('uuid');

class VerificationTokensRepository {
  constructor() {
    this._connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

    this._pool = new Pool({
      connectionString: this._connectionString,
    });

    this._table = process.env.VERIFICATION_TOKENS_TABLE;
  }

  async createVerificationToken(newUserId) {
    const pgQuery = `
        INSERT INTO ${this._table}
        (id, user_id, secret, expiry)
        VALUES ($1, $2, $3, (now() + interval '1h') at time zone 'utc')
      `;

    const secretCode = cryptoRandomString({ length: 10, type: 'base64' });

    await this._pool.query(pgQuery, [uuid.v4(), newUserId, secretCode]);

    return secretCode;
  }

  async verifyUser(userId, secretCode) {
    const pgQuery = `
        SELECT id
        FROM ${this._table}
        WHERE 
          user_id = $1 AND
          secret = $2 AND
          expiry >= now() at time zone 'utc'
      `;

    const response = (await this._pool.query(pgQuery, [userId, secretCode])).rows;

    if (!response.length) {
      return null;
    }

    return response[0];
  }

  async updateVerificationToken(id) {
    const pgQuery = `
      UPDATE ${this._table}
      SET secret = $1, expiry = (now() + interval '1h') at time zone 'utc'
      WHERE id = $2
    `;

    const newSecret = cryptoRandomString({ length: 10, type: 'base64' });

    await this._pool.query(pgQuery, [newSecret, id]);

    return newSecret;
  }
}

module.exports = new VerificationTokensRepository();
