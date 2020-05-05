'use strict'

const _repo = require('../repository/password-token.repository')

class PasswordTokenService {
    async createPasswordToken(userId) {
        return await _repo.createPasswordToken(userId);
    }
}

module.exports = new PasswordTokenService();
