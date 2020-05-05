'use strict';

const Joi = require('@hapi/joi');

class ValidationMiddleware {
  forSignUp(req, res, next) {
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
      confirmPassword: Joi.ref('password'),
      tags: Joi.array().sparse()
    });

    schema
      .validateAsync(req.body)
      .then((response) => {
        next();
      })
      .catch((error) => {
        console.log({ error });
        return res.status(400).send(error.message);
      });
  }

  forLogin(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      password: Joi.string().required(),
    });

    schema
      .validateAsync(req.body)
      .then((response) => {
        next();
      })
      .catch((error) => {
        console.log({ error });
        return res.status(400).send(error.message);
      });
  }

  forVerification(req, res, next) {
    const schema = Joi.object({
      userId: Joi.string().trim()
        .guid({ version: ['uuidv4'] })
        .required(),
      secretCode: Joi.string().trim().required(),
    });

    schema
      .validateAsync(req.body)
      .then((response) => {
        next();
      })
      .catch((error) => {
        console.log({ error });
        return res.status(400).send(error.message);
      });
  }

  forResendCode(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().trim().email(),
      userId: Joi.string().guid({ version: ['uuidv4'] }),
    }).xor('email', 'userId');

    schema
      .validateAsync(req.body)
      .then((response) => {
        next();
      })
      .catch((error) => {
        console.log({ error });
        return res.status(400).send(error.message);
      });
  }

  forResetPassword(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
    });

    schema
      .validateAsync(req.body)
      .then((response) => {
        next();
      })
      .catch((error) => {
        console.log({ error });
        return res.status(400).send(error.message);
      });
  }
}

module.exports = new ValidationMiddleware();
