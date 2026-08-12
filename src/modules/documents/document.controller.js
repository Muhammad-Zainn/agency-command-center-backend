const Document = require("./document.model");
const Project = require("../projects/project.model");
const Tenant = require("../../modules/tenants/tenant.model");
const User = require("../../modules/users/user.model");
const { generatePDF } = require("../../shared/utils/pdfGenerator");

// @desc    Generate a PDF Proposal for a specific project
// @route   POST /api/v1/documents/generate-proposal
// @access  Private
exports.generateProposal = async (req, res, next) => {
  try {
    // 1. Grab both the projectId AND the custom text the user typed
    const { projectId, customContent } = req.body;

    // 2. Fetch the project (and securely ensure it belongs to THIS agency)
    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.tenantId,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // 3. Fetch the Client and Agency info to populate the PDF
    const client = await User.findById(project.clientId);
    const tenant = await Tenant.findById(req.tenantId);

    // 4. Package the data exactly how our EJS template expects it
    const templateData = {
      agencyName: tenant.name,
      clientName: client.fullName,
      projectTitle: project.title,
      projectStatus: project.status,
      budget: project.budget || 0,
      customContent: customContent || {}, // 🔥 NEW: Inject the frontend data!
    };

    // 5. FIRE THE ENGINE! Generate the PDF and get the local URL back
    const pdfFileUrl = await generatePDF("proposal", templateData);

    // 6. Save the official document record in MongoDB
    const document = await Document.create({
      tenantId: req.tenantId,
      projectId: project._id,
      title: `${project.title} - Official Proposal`,
      type: "proposal",
      totalAmount: project.budget,
      pdfFileUrl: pdfFileUrl,
      customContent: customContent || {}, 
      status: "draft",
    });

    // 7. Send the success response back!
    res.status(201).json({
      message: "Dynamic Proposal PDF generated successfully! 🎉",
      document,
    });
  } catch (error) {
    next(error);
  }
};
