'use strict';

const Joi = require('@hapi/joi');

class ScheduleValidation {
  forCreate(req, res, next) {
    const schema = Joi.object({
      userId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required(),
      selectedUserId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required(),
      from: Joi.date().iso().required(),
      to: Joi.date().iso().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required(),
      comments: Joi.string().trim().allow(null).allow(''),
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

module.exports = new ScheduleValidation();
