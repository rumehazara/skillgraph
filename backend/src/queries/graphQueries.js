const GET_ALL_DEVELOPERS = `
  MATCH (d:Developer)
  RETURN d.name AS name,
         d.experience AS experience,
         d.location AS location
  ORDER BY d.name
`;

const GET_DEVELOPER = `
  MATCH (d:Developer {name: $name})
  OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (d)-[:BUILT]->(p:Project)
  RETURN d.name AS name,
         d.experience AS experience,
         d.location AS location,
         collect(DISTINCT s.name) AS skills,
         collect(DISTINCT p.name) AS projects
`;

const GET_ALL_PROJECTS = `
  MATCH (p:Project)
  OPTIONAL MATCH (p)-[:REQUIRES]->(s:Skill)
  OPTIONAL MATCH (p)-[:IN_DOMAIN]->(d:Domain)
  RETURN p.name AS name,
         p.description AS description,
         d.name AS domain,
         collect(DISTINCT s.name) AS requiredSkills
  ORDER BY p.name
`;

const GET_PROJECT = `
  MATCH (p:Project {name: $name})
  OPTIONAL MATCH (p)-[:REQUIRES]->(s:Skill)
  OPTIONAL MATCH (p)-[:IN_DOMAIN]->(d:Domain)
  OPTIONAL MATCH (developer:Developer)-[:BUILT]->(p)
  RETURN p.name AS name,
         p.description AS description,
         d.name AS domain,
         collect(DISTINCT s.name) AS requiredSkills,
         collect(DISTINCT developer.name) AS builtBy
`;
const GET_RECOMMENDATIONS = `
  MATCH (d:Developer {name: $developerName})
        -[:HAS_SKILL]->(s:Skill)
        -[:RELATED_TO]->(related:Skill)
        <-[:REQUIRES]-(p:Project)

  WITH p, collect(DISTINCT related.name) AS relevantSkills

  RETURN p.name AS project,
         p.description AS description,
         relevantSkills,
         size(relevantSkills) AS matchCount

  ORDER BY matchCount DESC, project ASC
`;

module.exports = {
  GET_ALL_DEVELOPERS,
  GET_DEVELOPER,
  GET_ALL_PROJECTS,
  GET_PROJECT,
  GET_RECOMMENDATIONS
};