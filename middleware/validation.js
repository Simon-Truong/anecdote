const Joi = require("@hapi/joi");

module.exports = (req, res, next) => {
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
