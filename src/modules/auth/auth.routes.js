const express = require("express");
const { registerAgency, login } = require("./auth.controller");

const router = express.Router();

router.post("/register", registerAgency);

router.post("/login", login);

module.exports = router;
