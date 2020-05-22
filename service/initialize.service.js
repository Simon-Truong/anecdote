'use strict';

const _repo = require('../repository/initialize.repository');

class InitializeService {
  async initialize(req, res) {
    try {
      await _repo.initialize();
      return res.status(200).send('Initialized successfully');
    } catch (error) {
      console.log({ error });
      return res.status(500).send(error);
    }
  }
}

module.exports = new InitializeService();
