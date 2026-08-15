const driver = require("../config/database");

const {
  GET_ALL_DEVELOPERS,
  GET_DEVELOPER,
  GET_ALL_PROJECTS,
  GET_PROJECT,
  GET_RECOMMENDATIONS
} = require("../queries/graphQueries");

async function runQuery(query, parameters = {}) {
  const session = driver.session();

  try {
    const result = await session.run(query, parameters);

    return result.records;
  } finally {
    await session.close();
  }
}

async function getAllDevelopers() {
  const records = await runQuery(GET_ALL_DEVELOPERS);

  return records.map((record) => ({
    name: record.get("name"),
    experience: record.get("experience"),
    location: record.get("location")
  }));
}

async function getDeveloper(name) {
  const records = await runQuery(GET_DEVELOPER, { name });

  if (records.length === 0) {
    return null;
  }

  const record = records[0];

  return {
    name: record.get("name"),
    experience: record.get("experience"),
    location: record.get("location"),
    skills: record.get("skills"),
    projects: record.get("projects")
  };
}

async function getAllProjects() {
  const records = await runQuery(GET_ALL_PROJECTS);

  return records.map((record) => ({
    name: record.get("name"),
    description: record.get("description"),
    domain: record.get("domain"),
    requiredSkills: record.get("requiredSkills")
  }));
}

async function getProject(name) {
  const records = await runQuery(GET_PROJECT, { name });

  if (records.length === 0) {
    return null;
  }

  const record = records[0];

  return {
    name: record.get("name"),
    description: record.get("description"),
    domain: record.get("domain"),
    requiredSkills: record.get("requiredSkills"),
    builtBy: record.get("builtBy")
  };
}

async function getRecommendations(developerName) {
  const records = await runQuery(
    GET_RECOMMENDATIONS,
    { developerName }
  );

  return records.map((record) => ({
    project: record.get("project"),
    description: record.get("description"),
    relevantSkills: record.get("relevantSkills"),
    matchCount: record.get("matchCount").toNumber()
  }));
}
module.exports = {
  getAllDevelopers,
  getDeveloper,
  getAllProjects,
  getProject,
  getRecommendations
};