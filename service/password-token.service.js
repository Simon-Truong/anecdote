'use strict';

const _repo = require('../repository/password-token.repository');

class PasswordTokenService {
  async getPasswordTokenbyUserId(userId) {
    return await _repo.getPasswordTokenbyUserId(userId);
  }

  async getPasswordToken(userId, secretCode) {
    return await _repo.getPasswordToken(userId, secretCode);
  }

  async createPasswordToken(userId) {
    return await _repo.createPasswordToken(userId);
  }

  async updatePasswordToken(passwordTokenId) {
    return await _repo.updatePasswordToken(passwordTokenId);
  }
}

module.exports = new PasswordTokenService();
