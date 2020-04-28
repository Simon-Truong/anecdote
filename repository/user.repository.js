'use strict';

const uuid = require('uuid');
const { Pool } = require('pg');
const pgp = require('pg-promise');

class UserRepository {
  constructor() {
    this._connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

    this._pool = new Pool({
      connectionString: this._connectionString,
    });

    this._table = process.env.USER_TABLE;
    this._verificationTokenTable = process.env.VERIFICATION_TOKENS_TABLE;
  }

  async getAllUsers() {
    const pgQuery = `
        SELECT *
        FROM ${this._table}
      `;

    return (await this._pool.query(pgQuery)).rows;
  }

  async searchUsers(query) {
    const pgQuery = `
        SELECT DISTINCT id, first_name, surname, tags
        FROM (SELECT id, first_name, surname, tags, unnest(tags) AS unnestedTags
          FROM ${this._table}) x
        WHERE 
        lower(first_name) LIKE $1 OR
        lower(surname) LIKE $1 OR
        lower(unnestedTags) LIKE $1
      `;

    return (await this._pool.query(pgQuery, [`%${query}%`])).rows;
  }

  async getUserByEmail(email) {
    const pgQuery = `
        SELECT *
        FROM ${this._table}
        WHERE email = $1
      `;

    const response = (await this._pool.query(pgQuery, [email])).rows;

    if (!response.length) {
      return null;
    }

    return response[0];
  }

  async createUser(newUser) {
    const { firstName, surname, email, password, tags } = newUser;

    const processedTags = tags ? `{${tags.join(', ')}}` : '{}';

    const pgQuery = `
        INSERT INTO ${this._table}
        (id, first_name, surname, email, password, joined, tags)
        VALUES ($1, $2, $3, $4, $5, now() at time zone 'utc', $6)
      `;

    const newUUID = uuid.v4();

    await this._pool.query(pgQuery, [newUUID, firstName, surname, email, password, processedTags]);

    return newUUID;
  }

  async verifyUserStatus(userId) {
    const pgQuery = `
      UPDATE ${this._table}
      SET verified = 'true'
      WHERE id = $1 
    `;

    return await this._pool.query(pgQuery, [userId]);
  }

  async findVerificationTokenIdByEmail(email) {
    const pgQuery = `
      SELECT ${this._verificationTokenTable}.id AS verificationTokenId, ${this._table}.id AS userId, first_name, verified
      FROM ${this._table}
      INNER JOIN ${this._verificationTokenTable} ON ${this._verificationTokenTable}.user_id = ${this._table}.id
      WHERE email = $1
    `;

    const response = (await this._pool.query(pgQuery, [email])).rows;

    if (!response.length) {
      return null;
    }

    return response[0];
  }
}

//! debugging purposes only
// const test = pgp.as.format(
//   `SQL query`,
//   [variables]
// );

// console.log({ test });

module.exports = new UserRepository();
