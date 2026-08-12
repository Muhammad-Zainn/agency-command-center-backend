const express = require("express");
const { generateProposal } = require("./document.controller");
const requireAuth = require("../../shared/middleware/requireAuth");
const requireTenant = require("../../shared/middleware/requireTenant");

const router = express.Router();

// Secure these routes
router.use(requireAuth);
router.use(requireTenant);

// Define the endpoint
router.post("/generate-proposal", generateProposal);

module.exports = router;
