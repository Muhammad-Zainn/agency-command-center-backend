const mongoose = require("mongoose");

// 1. Define the Schema (The Blueprint)
const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free_trial", "pro_tier"],
      default: "free_trial",
    },
  },
  { timestamps: true },
);

// 2. Export the Model so other files can use it
module.exports = mongoose.model("Tenant", tenantSchema);
