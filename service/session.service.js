'use strict'

const _repo = require('../repository/session.repository');

class SessionSevice {
    async createSession(userId) {
        return await _repo.createSession(userId);
    }
}

module.exports = new SessionSevice();