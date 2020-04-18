const express = require("express");
const validation = require("../middleware/validation");
const _service = require("../service/user.service");

const router = express.Router();

router.get("/users", async (req, res) => {
  await _service.getUsers(req, res);
});

router.post("/signup", validation.forSignUp, async (req, res) => {
  await _service.signUp(req, res);
});

router.post("/login", validation.forLogin, async (req, res) => {
  await _service.logIn(req, res);
});

module.exports = router;
