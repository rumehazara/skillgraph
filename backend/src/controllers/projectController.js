const graphService = require("../services/graphService");

async function getProjects(req, res) {
  try {
    const projects = await graphService.getAllProjects();

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    res.status(503).json({
      success: false,
      message: "Unable to connect to the graph database"
    });
  }
}

async function getProject(req, res) {
  try {
    const project = await graphService.getProject(req.params.name);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error("Failed to fetch project:", error);

    res.status(503).json({
      success: false,
      message: "Unable to connect to the graph database"
    });
  }
}

module.exports = {
  getProjects,
  getProject
};