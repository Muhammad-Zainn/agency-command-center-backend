const express = require("express");
// ... existing code ...
const { registerAgency, login } = require("./auth.controller");

const router = express.Router();

// When a POST request hits /api/v1/auth/register, it triggers the controller function
router.post("/register", registerAgency);

// When a POST request hits /api/v1/auth/login, it triggers the login function
router.post("/login", login);

module.exports = router;
