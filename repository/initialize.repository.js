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

  async createScheduleTable() {
    const pgQuery = `
      CREATE TABLE IF NOT EXISTS schedules(
          id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 ()
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (selected_user_id) REFERENCES users (id),
          from ,
      )
      `;
  }
}

module.exports = new InitializeRepository();
