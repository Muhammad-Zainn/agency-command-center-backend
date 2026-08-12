const express = require("express");
const { generateProposal } = require("./document.controller");
const requireAuth = require("../../shared/middleware/requireAuth");
const requireTenant = require("../../shared/middleware/requireTenant");

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

router.post("/generate-proposal", generateProposal);

module.exports = router;
