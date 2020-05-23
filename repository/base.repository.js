'use strict';

const { Pool } = require('pg');

const types = require('pg').types;
const moment = require('moment');
const parseFn = (value) => {
  return value === null ? null : moment.utc(value);
};

types.setTypeParser(types.builtins.TIMESTAMP, parseFn);

class BaseRepository {
  constructor(table) {
    this._connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.POSTGRESQL_PORT}/${process.env.DB}`;

    this._pool = new Pool({
      connectionString: this._connectionString,
    });

    this._table = table;
  }

  handlePgResponse(response) {
    if (!response.length) {
      return null;
    }

    return response[0];
  }
}

module.exports = BaseRepository;
