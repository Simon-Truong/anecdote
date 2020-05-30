'use strict';

const _repo = require('../repository/session.repository');

class SessionSevice {
  async getSession(userId) {
    return await _repo.getSession(userId);
  }

  async createSession(userId) {
    return await _repo.createSession(userId);
  }

  /**
   * for login
   */
  async updateSessionById(userId) {
    return await _repo.updateSessionById(userId);
  }

  async updateSessionByRefreshToken(refreshToken) {
    return await _repo.updateSessionByRefreshToken(refreshToken);
  }
}

module.exports = new SessionSevice();
