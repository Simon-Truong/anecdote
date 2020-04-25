const _repo = require('../repository/verify-tokens.repository');

async function createVerifyToken(newUserId) {
  await _repo.createVerifyToken(newUserId);
}

async function verifyUser(userId, secretCode) {
  return await _repo.verifyUser(userId, secretCode);
}

module.exports = {
  createVerifyToken,
  verifyUser,
};
