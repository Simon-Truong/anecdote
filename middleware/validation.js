'use strict';

const Joi = require('@hapi/joi');

const forSignUp = (req, res, next) => {
  'use strict';

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
    tags: Joi.array().sparse()
  });

  schema
    .validateAsync(req.body)
    .then((response) => {
      next();
    })
    .catch((error) => {
      console.log({ error });
      res.status(400).send(error.message);
    });
};

const forLogin = (req, res, next) => {
  'use strict';

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  schema
    .validateAsync(req.body)
    .then((response) => {
      next();
    })
    .catch((error) => {
      console.log({ error });
      res.status(400).send(error.message);
    });
};

module.exports = {
  forSignUp,
  forLogin,
};
