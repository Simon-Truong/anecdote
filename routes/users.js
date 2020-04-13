const express = require("express");
const router = express.Router();

const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

const pool = new Pool({
  connectionString,
});

router.get("/users", async (req, res) => {
  try {
    const { q } = req.query;

    const pgQuery = `
      SELECT DISTINCT id, first_name, surname, tags
      FROM (SELECT id, first_name, surname, tags, unnest(tags) AS unnestedTags
        FROM public.users) x
      WHERE 
      lower(first_name) LIKE $1 OR
      lower(surname) LIKE $1 OR
      lower(unnestedTags) LIKE $1
    `;

    const result = (await pool.query(pgQuery, [`%${q}%`])).rows;

    res.send(result);
  } catch (error) {
    console.log({ error });

    res.sendStatus(500);
  }
});

module.exports = router;
