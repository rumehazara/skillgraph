const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME,
    process.env.COGNODB_PASSWORD
  )
);

const developers = [
  {
    name: "Aarav Sharma",
    experience: 2,
    location: "Hyderabad"
  },
  {
    name: "Meera Reddy",
    experience: 3,
    location: "Bangalore"
  },
  {
    name: "Arjun Patel",
    experience: 1,
    location: "Pune"
  },
  {
    name: "Nisha Kumar",
    experience: 4,
    location: "Chennai"
  }
];

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Machine Learning",
  "TensorFlow",
  "Git"
];

const domains = [
  "Web Development",
  "Backend Development",
  "Cloud Computing",
  "Artificial Intelligence",
  "Data Science"
];

const projects = [
  {
    name: "E-Commerce Platform",
    description: "Full-stack online shopping platform",
    domain: "Web Development",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"]
  },
  {
    name: "AI Image Classifier",
    description: "Machine learning image classification application",
    domain: "Artificial Intelligence",
    skills: ["Python", "TensorFlow", "Machine Learning"]
  },
  {
    name: "Cloud Deployment Platform",
    description: "Application deployment platform using containers",
    domain: "Cloud Computing",
    skills: ["Docker", "AWS", "Node.js"]
  },
  {
    name: "Developer Analytics Dashboard",
    description: "Dashboard for tracking developer productivity",
    domain: "Data Science",
    skills: ["Python", "PostgreSQL", "JavaScript"]
  },
  {
    name: "Task Management API",
    description: "Scalable REST API for task management",
    domain: "Backend Development",
    skills: ["TypeScript", "Node.js", "PostgreSQL", "Docker"]
  }
];

const developerSkills = {
  "Aarav Sharma": ["JavaScript", "React", "Node.js", "Git"],
  "Meera Reddy": ["Python", "Machine Learning", "TensorFlow", "Git"],
  "Arjun Patel": ["JavaScript", "TypeScript", "Node.js", "MongoDB"],
  "Nisha Kumar": ["Python", "PostgreSQL", "Docker", "AWS", "Git"]
};

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Clearing existing database...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating domains...");

    for (const domain of domains) {
      await session.run(
        `
        CREATE (:Domain {
          name: $name
        })
        `,
        { name: domain }
      );
    }

    console.log("Creating skills...");

    for (const skill of skills) {
      await session.run(
        `
        CREATE (:Skill {
          name: $name
        })
        `,
        { name: skill }
      );
    }

    console.log("Creating developers...");

    for (const developer of developers) {
      await session.run(
        `
        CREATE (:Developer {
          name: $name,
          experience: $experience,
          location: $location
        })
        `,
        developer
      );
    }

    console.log("Creating projects...");

    for (const project of projects) {
      await session.run(
        `
        MATCH (d:Domain {name: $domain})
        CREATE (p:Project {
          name: $name,
          description: $description
        })
        CREATE (p)-[:IN_DOMAIN]->(d)
        `,
        {
          name: project.name,
          description: project.description,
          domain: project.domain
        }
      );

      for (const skill of project.skills) {
        await session.run(
          `
          MATCH (p:Project {name: $projectName})
          MATCH (s:Skill {name: $skillName})
          CREATE (p)-[:REQUIRES]->(s)
          `,
          {
            projectName: project.name,
            skillName: skill
          }
        );
      }
    }

    console.log("Connecting developers to skills...");

    for (const [developerName, developerSkillList] of Object.entries(
      developerSkills
    )) {
      for (const skill of developerSkillList) {
        await session.run(
          `
          MATCH (d:Developer {name: $developerName})
          MATCH (s:Skill {name: $skillName})
          CREATE (d)-[:HAS_SKILL]->(s)
          `,
          {
            developerName,
            skillName: skill
          }
        );
      }
    }
    console.log("Creating developer-project relationships...");

const developerProjects = [
  ["Aarav Sharma", "E-Commerce Platform"],
  ["Meera Reddy", "AI Image Classifier"],
  ["Arjun Patel", "Task Management API"],
  ["Nisha Kumar", "Cloud Deployment Platform"]
];

for (const [developerName, projectName] of developerProjects) {
  await session.run(
    `
    MATCH (d:Developer {name: $developerName})
    MATCH (p:Project {name: $projectName})
    CREATE (d)-[:BUILT]->(p)
    `,
    {
      developerName,
      projectName
    }
  );
}

    console.log("Creating related skill relationships...");

    const relatedSkills = [
      ["JavaScript", "TypeScript"],
      ["React", "JavaScript"],
      ["Node.js", "JavaScript"],
      ["Python", "Machine Learning"],
      ["Machine Learning", "TensorFlow"],
      ["Docker", "AWS"],
      ["PostgreSQL", "Python"]
    ];

    for (const [skillA, skillB] of relatedSkills) {
      await session.run(
        `
        MATCH (a:Skill {name: $skillA})
        MATCH (b:Skill {name: $skillB})
        CREATE (a)-[:RELATED_TO]->(b)
        CREATE (b)-[:RELATED_TO]->(a)
        `,
        {
          skillA,
          skillB
        }
      );
    }

    console.log("✅ Database seeded successfully!");

  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();