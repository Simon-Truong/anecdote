'use strict';

const BaseRepository = require('./base.repository');

class InitializeRepository extends BaseRepository {
  constructor() {
    super();
  }

  async initialize() {
    await this.createUUIDExtension();

    await this.createScheduleTable();
  }

  async createUUIDExtension() {
    const pgQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    await this._pool.query(pgQuery);
  }

  async createPasswordTokensTable() {
    const pgQuery = `
        CREATE TABLE IF NOT EXISTS passwordtokens(
            id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
            user_id uuid NOT NULL REFERENCES users (id),
            secret uuid NOT NULL DEFAULT uuid_generate_v4 (),
            expiry timestamp without time zone NOT NULL DEFAULT ((now() + interval '1h') at time zone 'utc')
        )`;

    await pgQuery.query(pgQuery);
  }

  async createScheduleTable() {
    const pgQuery = `
        CREATE TABLE IF NOT EXISTS schedules(
            id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
            user_id uuid NOT NULL REFERENCES users (id),
            selected_user_id uuid NOT NULL REFERENCES users (id),
            time_from timestamp without time zone NOT NULL,
            time_to timestamp without time zone NOT NULL,
            lat smallint NOT NULL,
            lng smallint NOT NULL,
            comments varchar (255)
        )
    `;

    await this._pool.query(pgQuery);
  }
}

module.exports = new InitializeRepository();
