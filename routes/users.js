const express = require("express");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const validation = require("../middleware/validation");
const { Pool } = require("pg");

const router = express.Router();

const connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

const pool = new Pool({
  connectionString,
});

router.get("/users", async (req, res) => {
  try {
    const { q } = req.query;

    result = await getUsers(q);

    res.send(result);
  } catch (error) {
    console.log({ error });

    res.status(400).send(error);
  }
});

router.post("/user", validation, async (req, res) => {
  const { body } = req;

  try {
    var existentUser = await getUserByEmail(body.email);
  } catch (error) {
    return res.status(400).send(error);
  }

  if (existentUser.length) {
    return res.status(400).send("Email is already in use.");
  }

  const SALT_ROUNDS = 10;

  bcrypt.hash(body.password, SALT_ROUNDS, async (error, hash) => {
    if (error) {
      return res.status(400);
    }

    const newUser = body;
    newUser.password = hash;

    try {
      var result = await createUser(newUser);
    } catch (error) {
      return res.status(400).send(error);
    }

    console.log({ result });
  });
});

async function getUsers(query) {
  const pgQuery = `
    SELECT DISTINCT id, first_name, surname, tags
    FROM (SELECT id, first_name, surname, tags, unnest(tags) AS unnestedTags
      FROM ${process.env.TABLE}) x
    WHERE 
    lower(first_name) LIKE $1 OR
    lower(surname) LIKE $1 OR
    lower(unnestedTags) LIKE $1
  `;

  return (await pool.query(pgQuery, [`%${query}%`])).rows;
}

async function getUserByEmail(email) {
  const pgQuery = `
    SELECT id
    FROM ${process.env.TABLE}
    WHERE email = $1
  `;

  return (await pool.query(pgQuery, [email])).rows;
}

async function createUser(newUser) {
  const { firstName, surname, email, password, joined } = newUser;

  const pgQuery = `
    INSERT INTO ${process.env.TABLE} (id, first_name, surname, email, password, joined)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  return await pool.query(pgQuery, [uuid.v4(), firstName, surname, email, password, joined]);
}

module.exports = router;
