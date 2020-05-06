'use strict';

const pgp = require('pg-promise');
const uuid = require('uuid');

const BaseRepository = require('./base.repository');

class PasswordTokenRepository extends BaseRepository {
    constructor() {
        super();

        this._table = process.env.PASSWORD_TOKENS_TABLE;
    }

    async getPasswordTokenbyUserId(userId) {
        const pgQuery = `
            SELECT id 
            FROM ${this._table}
            WHERE user_id = $1
        `;

        const response = (await this._pool.query(pgQuery, [userId])).rows;

        if (!response.length) {
            return null;
        }

        return response[0];
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

    async updatePasswordToken(passwordTokenId) {
        const pgQuery = `
            UPDATE ${this._table}
            SET secret = $1, expiry = (now() + interval '1h') at time zone 'utc'
            WHERE id = $2
        `;

        const newSecret = uuid.v4();

        await this._pool.query(pgQuery, [newSecret, passwordTokenId]);

        return newSecret;
    }
}

module.exports = new PasswordTokenRepository();
