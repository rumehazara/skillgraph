const express = require("express");

const {
  getDevelopers,
  getDeveloper,
  getRecommendations
} = require("../controllers/developerController");

const router = express.Router();

router.get("/", getDevelopers);

router.get("/:name/recommendations", getRecommendations);

router.get("/:name", getDeveloper);

module.exports = router;