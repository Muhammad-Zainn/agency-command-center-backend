const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tenant = require("../tenants/tenant.model");
const User = require("../../modules/users/user.model");

// @desc    Register a new Agency (Tenant) and their Admin User
// @route   POST /api/v1/auth/register
exports.registerAgency = async (req, res, next) => {
  try {
    const { agencyName, subdomain, fullName, email, password } = req.body;

    // 1. Check if agency subdomain or user email already exists
    const existingTenant = await Tenant.findOne({ subdomain });
    if (existingTenant) {
      return res
        .status(400)
        .json({ error: "Subdomain already taken. Please choose another." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // 2. Create the Tenant (Agency)
    const tenant = await Tenant.create({
      name: agencyName,
      subdomain,
      subscriptionPlan: "free_trial", // Default plan
    });

    // 3. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create the Super Admin User for this Tenant
    const user = await User.create({
      tenantId: tenant._id, // 🔥 Links user to the newly created agency
      fullName,
      email,
      passwordHash,
      role: "agency_admin",
    });

    // 5. Generate JWT Token (Your digital passport)
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expires in 1 day
    );

    // 6. Send Response back to the frontend
    res.status(201).json({
      message: "Agency registered successfully! 🚀",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        subdomain: tenant.subdomain,
      },
    });
  } catch (error) {
    next(error); // Passes the error to your global errorHandler
  }
};

// @desc    Login a user (Admin, Staff, or Client)
// @route   POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 2. Check if the password matches the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 3. Generate a new JWT token for them
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 4. Send the token back so their browser can save it
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
