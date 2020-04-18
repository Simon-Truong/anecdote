const uuid = require("uuid");
const pgp = require("pg-promise");
const { Pool } = require("pg");

const _connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

const _pool = new Pool({
  connectionString: _connectionString,
});

async function getAllUsers() {
  const pgQuery = `
      SELECT *
      FROM ${process.env.TABLE}
    `;

  return (await _pool.query(pgQuery)).rows;
}

async function searchUsers(query) {
  const pgQuery = `
      SELECT DISTINCT id, first_name, surname, tags
      FROM (SELECT id, first_name, surname, tags, unnest(tags) AS unnestedTags
        FROM ${process.env.TABLE}) x
      WHERE 
      lower(first_name) LIKE $1 OR
      lower(surname) LIKE $1 OR
      lower(unnestedTags) LIKE $1
    `;

  return (await _pool.query(pgQuery, [`%${query}%`])).rows;
}

async function getUserByEmail(email) {
  const pgQuery = `
      SELECT *
      FROM ${process.env.TABLE}
      WHERE email = $1
    `;

  return (await _pool.query(pgQuery, [email])).rows;
}

async function createUser(newUser) {
  const { firstName, surname, email, password, joined } = newUser;

  const pgQuery = `
      INSERT INTO ${process.env.TABLE} (id, first_name, surname, email, password, joined)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

  return await _pool.query(pgQuery, [uuid.v4(), firstName, surname, email, password, joined]);
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
};
