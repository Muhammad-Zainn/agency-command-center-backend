const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // 1. Look for the token in the request headers
  const authHeader = req.headers.authorization;

  // 2. Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // 3. Extract just the token part (remove the word "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded data (userId, tenantId, role) to the request!
    req.user = decoded;

    // 6. Move on to the next function (the controller)
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = requireAuth;
