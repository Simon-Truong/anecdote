const express = require("express");
const router = express.Router();

const { Pool } = require("pg");

const connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

const pool = new Pool({
  connectionString,
});

router.get("/users", async (req, res) => {
  try {
    const result = (await pool.query("SELECT * FROM users")).rows;

    res.send(result);
  } catch (error) {
    console.log({ error });
  } finally {
    pool.end();
  }
});

module.exports = router;
