const requireTenant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (!req.user.tenantId) {
    return res
      .status(403)
      .json({ error: "Access denied. You do not belong to an agency." });
  }

  req.tenantId = req.user.tenantId;

  next();
};

module.exports = requireTenant;
