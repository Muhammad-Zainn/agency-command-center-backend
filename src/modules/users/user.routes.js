const express = require("express");
const { createUser, getUsers } = require("./user.controller");
const requireAuth = require("../../shared/middleware/requireAuth");
const requireTenant = require("../../shared/middleware/requireTenant");

const router = express.Router();

// Apply security middlewares
router.use(requireAuth);
router.use(requireTenant);

// Define endpoints
router.post("/", createUser);
router.get("/", getUsers);

module.exports = router;
