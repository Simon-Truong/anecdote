const _repo = require('../repository/verify-tokens.repository');

class VerifyTokensService {
  async createVerifyToken(newUserId) {
    await _repo.createVerifyToken(newUserId);
  }

  async verifyUser(userId, secretCode) {
    return await _repo.verifyUser(userId, secretCode);
  }
}

module.exports = new VerifyTokensService();
