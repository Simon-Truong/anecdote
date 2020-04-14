const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");

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

    res.sendStatus(400);
  }
});

router.post("/user", (req, res) => {
  console.log(req.body);

  const { firstName, surname, email } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().trim().required(),
    surname: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .pattern(new RegExp(/[A-Z]/))
      .pattern(new RegExp(/[a-z]/))
      .pattern(new RegExp(/[0-9]/))
      .pattern(new RegExp(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/))
      .pattern(new RegExp(`^((?!${firstName}|${surname}|${email}).)*$`))
      .required(),
    joined: Joi.date().iso().required(),
  });

  try {
    const result = schema.validateAsync(req.body);
    console.log({ result });
  } catch (error) {
    console.log({ error });
  }
});

module.exports = router;
