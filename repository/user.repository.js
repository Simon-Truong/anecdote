'use strict';

const uuid = require('uuid');
const cryptoRandomString = require('crypto-random-string');
const { Pool } = require('pg');
const moment = require('moment');
const pgp = require('pg-promise');

const _connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

const _pool = new Pool({
  connectionString: _connectionString,
});

async function getAllUsers() {
  'use strict';

  const pgQuery = `
      SELECT *
      FROM ${process.env.USER_TABLE}
    `;

  return (await _pool.query(pgQuery)).rows;
}

async function searchUsers(query) {
  'use strict';

  const pgQuery = `
      SELECT DISTINCT id, first_name, surname, tags
      FROM (SELECT id, first_name, surname, tags, unnest(tags) AS unnestedTags
        FROM ${process.env.USER_TABLE}) x
      WHERE 
      lower(first_name) LIKE $1 OR
      lower(surname) LIKE $1 OR
      lower(unnestedTags) LIKE $1
    `;

  return (await _pool.query(pgQuery, [`%${query}%`])).rows;
}

async function getUserByEmail(email) {
  'use strict';

  const pgQuery = `
      SELECT *
      FROM ${process.env.USER_TABLE}
      WHERE email = $1
    `;

  const response = (await _pool.query(pgQuery, [email])).rows;

  if (!response.length) {
    return null;
  }

  return response[0];
}

async function createUser(newUser) {
  'use strict';

  const { firstName, surname, email, password, tags } = newUser;

  const processedTags = tags ? `{${tags.join(', ')}}` : '{}';

  const pgQuery = `
      INSERT INTO ${process.env.USER_TABLE}
      (id, first_name, surname, email, password, joined, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

  const newUUID = uuid.v4();

  await _pool.query(pgQuery, [newUUID, firstName, surname, email, password, moment.utc(), processedTags]);

  return newUUID;
}

async function createVerifyToken(newUserId) {
  'use strict';

  const pgQuery = `
    INSERT INTO ${process.env.VERIFY_TOKENS_TABLE}
    (id, userid, secret, expiry)
    VALUES ($1, $2, $3, $4)
  `;

  const secretCode = cryptoRandomString({ length: 10, type: 'base64' })

  await _pool.query(pgQuery, [uuid.v4(), newUserId, secretCode, moment().add(1, 'h').utc()]);

  return secretCode;
}

//! debugging purposes only
// const test = pgp.as.format(
//   `SQL query`,
//   [variables]
// );

// console.log({ test });

module.exports = {
  getAllUsers,
  searchUsers,
  getUserByEmail,
  createUser,
  createVerifyToken
};
