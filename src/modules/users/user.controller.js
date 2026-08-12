const User = require("./user.model");
const bcrypt = require("bcryptjs");

// @desc    Create a new user (Staff or Client) for the Agency
// @route   POST /api/v1/users
// @access  Private (Requires Auth & Tenant)
exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role, clientCompanyName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      tenantId: req.tenantId,
      fullName,
      email,
      passwordHash,
      role: role || "client",
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
