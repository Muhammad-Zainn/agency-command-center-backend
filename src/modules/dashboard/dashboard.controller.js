const Project = require("../projects/project.model");
const User = require("../users/user.model");
const Document = require("../documents/document.model");

// @desc    Get agency analytics, total earnings, completed projects, and client summaries
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    const projects = await Project.find({ tenantId }).populate(
      "clientId",
      "fullName email clientCompanyName",
    );

    const totalPotentialRevenue = projects.reduce(
      (sum, p) => sum + (p.budget || 0),
      0,
    );

    const completedProjects = projects.filter((p) => p.status === "completed");
    const totalEarningsFromCompleted = completedProjects.reduce(
      (sum, p) => sum + (p.budget || 0),
      0,
    );

    const statusBreakdown = {
      planning: projects.filter((p) => p.status === "planning").length,
      in_progress: projects.filter((p) => p.status === "in_progress").length,
      client_review: projects.filter((p) => p.status === "client_review")
        .length,
      completed: completedProjects.length,
      total: projects.length,
    };

    const clients = await User.find({ tenantId, role: "client" }).select(
      "-passwordHash",
    );

    const clientDetails = clients.map((client) => {
      const clientProjects = projects.filter(
        (p) =>
          p.clientId && p.clientId._id.toString() === client._id.toString(),
      );
      const clientSpend = clientProjects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0,
      );

      return {
        id: client._id,
        fullName: client.fullName,
        email: client.email,
        companyName: client.clientCompanyName || "Independent",
        totalProjects: clientProjects.length,
        totalSpend: clientSpend,
        projects: clientProjects,
      };
    });

    res.status(200).json({
      metrics: {
        totalEarningsFromCompleted,
        totalPotentialRevenue,
        statusBreakdown,
      },
      clientDetails,
    });
  } catch (error) {
    next(error);
  }
};
