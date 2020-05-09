const _repo = require('../repository/verify-token.repository');

class VerificationTokensService {
  async createVerificationToken(newUserId) {
    return await _repo.createVerificationToken(newUserId);
  }

  async getVerificationToken(userId, secretCode) {
    return await _repo.getVerificationToken(userId, secretCode);
  }

  async updateVerificationToken(id) {
    return await _repo.updateVerificationToken(id);
  }
}

module.exports = new VerificationTokensService();
