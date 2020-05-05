'use strict';

const pgp = require('pg-promise');
const uuid = require('uuid');

const BaseRepository = require('./base.repository');

class PasswordTokenRepository extends BaseRepository {
    constructor() {
        super();

        this._table = process.env.PASSWORD_TOKENS_TABLE;
    }

    async createPasswordToken(userId) {
        const pgQuery = `
            INSERT INTO ${this._table}
            (id, user_id, secret, expiry)
            VALUES ($1, $2, $3, (now() + interval '1h') at time zone 'utc')
        `;

        const secret = uuid.v4();

        await this._pool.query(pgQuery, [uuid.v4(), userId, secret]);

        return secret;
    }
}

module.exports = new PasswordTokenRepository();
