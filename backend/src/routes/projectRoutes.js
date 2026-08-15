const express = require("express");

const {
  getProjects,
  getProject
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects);

router.get("/:name", getProject);

module.exports = router;