const User = require("./user.model");
const bcrypt = require("bcryptjs");

// @desc    Create a new user (Staff or Client) for the Agency
// @route   POST /api/v1/users
// @access  Private (Requires Auth & Tenant)
exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role, clientCompanyName } = req.body;

    // 1. Ensure the email isn't already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // 2. Hash their password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create the user and lock them to the Agency's Tenant ID!
    const user = await User.create({
      tenantId: req.tenantId, // Attached by the Iron Wall middleware
      fullName,
      email,
      passwordHash,
      role: role || "client", // Default to client if no role is provided
      clientCompanyName,
    });

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        company: user.clientCompanyName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users belonging to the current Agency
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = async (req, res, next) => {
  try {
    // Find ONLY the users glued to this specific agency
    // .select('-passwordHash') ensures we don't accidentally send passwords back!
    const users = await User.find({ tenantId: req.tenantId }).select(
      "-passwordHash",
    );

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
