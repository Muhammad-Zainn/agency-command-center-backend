const mongoose = require("mongoose");

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

module.exports = mongoose.model("Tenant", tenantSchema);
