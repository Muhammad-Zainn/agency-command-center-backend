const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    // ⭐️ Multi-Tenant Rule: Ties this document to a specific Agency
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    // The One-to-Many Relationship: Which project does this belong to?
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["proposal", "invoice", "api_spec", "contract"],
      required: true,
    },
    totalAmount: {
      type: Number, // Primarily used if type is 'invoice' or 'proposal'
    },

    customContent: {
      type: Object,
      default: {},
    },

    // The link to AWS S3 / Cloud Storage
    pdfFileUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "signed"],
      default: "draft",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
