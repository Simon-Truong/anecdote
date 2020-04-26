const _repo = require('../repository/verify-tokens.repository');

class VerificationTokensService {
  async createVerificationToken(newUserId) {
    return await _repo.createVerificationToken(newUserId);
  }

  async verifyUser(userId, secretCode) {
    return await _repo.verifyUser(userId, secretCode);
  }
}

module.exports = new VerificationTokensService();
