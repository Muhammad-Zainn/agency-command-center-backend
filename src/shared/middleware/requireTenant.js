const requireTenant = (req, res, next) => {
  // 1. Make sure requireAuth already ran and attached the user data
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  // 2. The Multi-Tenant Check: Do they have an agency ID?
  if (!req.user.tenantId) {
    return res
      .status(403)
      .json({ error: "Access denied. You do not belong to an agency." });
  }

  // 3. Attach the tenantId directly to the request for easy access in our controllers
  req.tenantId = req.user.tenantId;

  // 4. Move on to the next function
  next();
};

module.exports = requireTenant;
