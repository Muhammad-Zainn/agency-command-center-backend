require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./shared/middleware/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.routes");
const userRoutes = require("./modules/users/user.routes");
const documentRoutes = require("./modules/documents/document.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes"); // NEW: Dashboard Analytics

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes); // NEW: Mount Dashboard routes

app.get("/api/health", (req, res) => {
  res.json({
    status: "active",
    message: "SaaS Command Center API is running! 🚀",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use(errorHandler);
