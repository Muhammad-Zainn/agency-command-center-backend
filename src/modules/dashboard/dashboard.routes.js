const express = require("express");
const { getDashboardStats } = require("./dashboard.controller");
const requireAuth = require("../../shared/middleware/requireAuth");
const requireTenant = require("../../shared/middleware/requireTenant");

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

router.get("/stats", getDashboardStats);

module.exports = router;
