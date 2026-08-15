const graphService = require("../services/graphService");

async function getDevelopers(req, res) {
  try {
    const developers = await graphService.getAllDevelopers();

    res.json({
      success: true,
      data: developers
    });
  } catch (error) {
    console.error("Failed to fetch developers:", error);

    res.status(503).json({
      success: false,
      message: "Unable to connect to the graph database"
    });
  }
}

async function getDeveloper(req, res) {
  try {
    const developer = await graphService.getDeveloper(
      req.params.name
    );

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found"
      });
    }

    res.json({
      success: true,
      data: developer
    });
  } catch (error) {
    console.error("Failed to fetch developer:", error);

    res.status(503).json({
      success: false,
      message: "Unable to connect to the graph database"
    });
  }
}

async function getRecommendations(req, res) {
  try {
    const developerName = req.params.name;

    const recommendations =
      await graphService.getRecommendations(developerName);

    res.json({
      success: true,
      developer: developerName,
      data: recommendations
    });
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);

    res.status(503).json({
      success: false,
      message: "Unable to generate recommendations"
    });
  }
}

module.exports = {
  getDevelopers,
  getDeveloper,
  getRecommendations
};