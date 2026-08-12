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
    const { projectId, customContent } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      tenantId: req.tenantId,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const client = await User.findById(project.clientId);
    const tenant = await Tenant.findById(req.tenantId);

    const templateData = {
      agencyName: tenant.name,
      clientName: client.fullName,
      projectTitle: project.title,
      projectStatus: project.status,
      budget: project.budget || 0,
      customContent: customContent || {}, 
    };

    const pdfFileUrl = await generatePDF("proposal", templateData);

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

    res.status(201).json({
      message: "Proposal PDF generated successfully!",
      document,
    });
  } catch (error) {
    next(error);
  }
};
