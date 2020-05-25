'use strict';

const BaseRepository = require('./base.repository');

class InitializeRepository extends BaseRepository {
  constructor() {
    super();
  }

  async initialize() {
    await this.createUUIDExtension();

    await this.createUsersTable();

    await this.createPasswordTokensTable();

    await this.createVerificationTokensTable();

    await this.createSchedulesTable();

    await this.createSessionsTable();
  }

  async createUUIDExtension() {
    const pgQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    await this._pool.query(pgQuery);
  }

  async createUsersTable() {
    const pgQuery = `
      CREATE TABLE IF NOT EXISTS ${process.env.USERS_TABLE} (
        id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
        first_name varchar NOT NULL,
        surname varchar NOT NULL,
        email varchar NOT NULL,
        password varchar NOT NULL,
        tags varchar[] DEFAULT '{}',
        joined timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
        verified boolean DEFAULT false
      )
    `;

    await this._pool.query(pgQuery);
  }

  async createPasswordTokensTable() {
    const pgQuery = `
        CREATE TABLE IF NOT EXISTS ${process.env.PASSWORD_TOKENS_TABLE} (
            id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
            user_id uuid NOT NULL REFERENCES ${process.env.USERS_TABLE} (id),
            secret uuid NOT NULL DEFAULT uuid_generate_v4 (),
            expiry timestamp without time zone NOT NULL DEFAULT ((now() + interval '1h') at time zone 'utc')
        )`;

    await this._pool.query(pgQuery);
  }

  async createVerificationTokensTable() {
    const pgQuery = `
      CREATE TABLE IF NOT EXISTS ${process.env.VERIFICATION_TOKENS_TABLE} (
        id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
        user_id uuid NOT NULL REFERENCES ${process.env.USERS_TABLE} (id),
        secret char(10) NOT NULL,
        expiry timestamp without time zone NOT NULL DEFAULT ((now() + interval '1h') at time zone 'utc')
      )`;

    await this._pool.query(pgQuery);
  }

  async createSchedulesTable() {
    const pgQuery = `
        CREATE TABLE IF NOT EXISTS ${process.env.SCHEDULES_TABLE} (
            id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
            user_id uuid NOT NULL REFERENCES ${process.env.USERS_TABLE} (id),
            selected_user_id uuid NOT NULL REFERENCES ${process.env.USERS_TABLE} (id),
            time_from timestamp without time zone NOT NULL,
            time_to timestamp without time zone NOT NULL,
            lat real NOT NULL,
            lng real NOT NULL,
            comments varchar (255)
        )
    `;

    await this._pool.query(pgQuery);
  }

  async createSessionsTable() {
    const pgQuery = `
      CREATE TABLE IF NOT EXISTS ${process.env.SESSIONS_TABLE} (
        id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
        user_id uuid NOT NULL REFERENCES ${process.env.USERS_TABLE} (id)
      )
    `

    await this._pool.query(pgQuery);
  }
}

module.exports = new InitializeRepository();
