'use strict';

const { Pool } = require('pg');
const pgp = require('pg-promise');
const cryptoRandomString = require('crypto-random-string');
const moment = require('moment');

const _connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

const _pool = new Pool({
  connectionString: _connectionString,
});

async function createVerifyToken(newUserId) {
  'use strict';

  const pgQuery = `
      INSERT INTO ${process.env.VERIFY_TOKENS_TABLE}
      (id, userid, secret, expiry)
      VALUES ($1, $2, $3, $4)
    `;

  const secretCode = cryptoRandomString({ length: 10, type: 'base64' });

  await _pool.query(pgQuery, [uuid.v4(), newUserId, secretCode, moment().add(1, 'h').utc()]);

  return secretCode;
}

async function getSecretByUserId(userId) {
  'use strict';

  const pgQuery = `
      SELECT *
      FROM ${process.env.VERIFY_TOKENS_TABLE}
      WHERE userid = $1
    `;

  const response = await (await _pool.query(pgQuery, [userId])).rows;

  if (!response.length) {
    return null;
  }

  return response[0];
}

module.exports = {
  createVerifyToken,
  getSecretByUserId,
};
