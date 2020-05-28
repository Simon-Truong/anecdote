'use strict';

const _repo = require('../repository/session.repository');

class SessionSevice {
  async getSession(userId) {
    return await _repo.getSession(userId);
  }

  async createSession(userId) {
    return await _repo.createSession(userId);
  }

  async updateSession(userId){
    return await _repo.updateSession(userId);
  }
}

module.exports = new SessionSevice();
