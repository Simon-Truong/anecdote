const _repo = require('../repository/verify-token.repository');

class VerificationTokensService {
  async createVerificationToken(newUserId) {
    return await _repo.createVerificationToken(newUserId);
  }

  async verifyUser(userId, secretCode) {
    return await _repo.verifyUser(userId, secretCode);
  }

  async updateVerificationToken(id) {
    return await _repo.updateVerificationToken(id);
  }
}

module.exports = new VerificationTokensService();
