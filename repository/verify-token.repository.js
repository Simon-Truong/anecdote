'use strict';

const pgp = require('pg-promise');
const cryptoRandomString = require('crypto-random-string');
const uuid = require('uuid');

const BaseRepository = require('./base.repository');

class VerificationTokensRepository extends BaseRepository {
  constructor() {
    super(process.env.VERIFICATION_TOKENS_TABLE);
  }

  async createVerificationToken(newUserId) {
    const pgQuery = `
        INSERT INTO ${this._table}
        (user_id, secret)
        VALUES ($1, $2)
      `;

    const secretCode = cryptoRandomString({ length: 10, type: 'base64' });

    await this._pool.query(pgQuery, [newUserId, secretCode]);

    return secretCode;
  }

  async getVerificationToken(userId, secretCode) {
    const pgQuery = `
        SELECT expiry
        FROM ${this._table}
        WHERE 
          user_id = $1 AND
          secret = $2
      `;

    const response = (await this._pool.query(pgQuery, [userId, secretCode])).rows;

    return this.handlePgResponse(response);
  }

  async updateVerificationToken(id) {
    const pgQuery = `
      UPDATE ${this._table}
      SET secret = $1, expiry = DEFAULT
      WHERE id = $2
    `;

    const newSecret = cryptoRandomString({ length: 10, type: 'base64' });

    await this._pool.query(pgQuery, [newSecret, id]);

    return newSecret;
  }
}

module.exports = new VerificationTokensRepository();
