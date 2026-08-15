# SkillGraph

> A graph-powered developer-to-project recommendation application built with CognoDB.

SkillGraph helps users discover projects that best match a developer's existing technical skills. Instead of treating skills and projects as isolated records, SkillGraph models their relationships as a graph and uses Cypher queries to discover relevant connections.

---

## 🚀 Overview

SkillGraph is a full-stack web application built for the Wexa AI take-home assignment.

The application:

- Stores developers, skills, projects, and domains in CognoDB.
- Connects developers with their technical skills.
- Connects developers with projects they have worked on.
- Models relationships between related skills.
- Uses graph traversal to find projects relevant to a developer.
- Ranks recommended projects based on the number of matching skills.
- Provides a clean web interface for non-technical users.

---

## 🧠 Why a Graph Database?

The main value of SkillGraph comes from the relationships between entities.

A relational database could store developers, skills, and projects in separate tables, but queries involving multiple levels of relationships would require several JOIN operations.

For example:

```text
Developer
   ↓
HAS_SKILL
   ↓
Skill
   ↓
RELATED_TO
   ↓
Related Skill
   ↓
REQUIRED_BY
   ↓
Project
A graph database allows these relationships to be traversed naturally using Cypher.

This makes graph traversal particularly useful for questions such as:

Which projects match a developer's skills?
Which projects have the highest number of matching skills?
Which skills are related to a developer's existing skills?
Which projects can be discovered through multi-hop skill relationships?

The graph model keeps the relationships explicit and makes these connection-oriented queries easier to express.

🏗️ Architecture
┌──────────────────────────┐
│      React Frontend      │
│      Vite + CSS          │
│      localhost:5173      │
└────────────┬─────────────┘
             │ HTTP / REST
             ▼
┌──────────────────────────┐
│      Express Backend     │
│      Node.js             │
│      localhost:5000      │
└────────────┬─────────────┘
             │
             │ Neo4j Driver
             ▼
┌──────────────────────────┐
│        CognoDB           │
│    Graph Database        │
│      Bolt Protocol       │
└──────────────────────────┘
🗂️ Graph Data Model

The application uses the following main graph entities:

Developer
Skill
Project
Domain

The graph contains typed relationships between these entities.

Graph Model
Example
(Aarav Sharma:Developer)
        │
        ├── HAS_SKILL ──> (React:Skill)
        │
        ├── HAS_SKILL ──> (Node.js:Skill)
        │
        └── WORKED_ON ──> (E-Commerce Platform:Project)
                                  │
                                  ├── REQUIRES ──> React
                                  ├── REQUIRES ──> Node.js
                                  └── REQUIRES ──> JavaScript
🔍 How Recommendation Works

When a developer is selected, the backend queries the graph for projects connected to the developer's skills.

For example, Aarav Sharma has:

JavaScript
React
Node.js
Git

The graph finds projects containing matching skills.

The resulting projects are ranked by the number of matching skills.

Example:

Project	Matching Skills	Match Count
E-Commerce Platform	React, Node.js, JavaScript	3
Task Management API	TypeScript, Node.js	2
Cloud Deployment Platform	Node.js	1
Developer Analytics Dashboard	JavaScript	1

This gives the user an understandable explanation for why a project was recommended.

🔗 Multi-Hop Graph Traversal

SkillGraph also supports graph traversal beyond a direct developer-to-skill relationship.

For example:

Developer
   ↓
HAS_SKILL
   ↓
Skill
   ↓
RELATED_TO
   ↓
Related Skill

A multi-hop traversal can discover skills that are related to a developer's current skill set.

This demonstrates one of the main advantages of using a graph database for the application.

💻 Technology Stack
Frontend
React
Vite
JavaScript
CSS
Lucide React
Backend
Node.js
Express.js
CORS
dotenv
Nodemon
Database
CognoDB
OpenCypher
Bolt protocol
Official Neo4j JavaScript Driver
📁 Project Structure
skillgraph/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   ├── queries/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── scripts/
│   │   └── seed.js
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── README.md
└── .gitignore
⚙️ Prerequisites

Make sure the following are installed:

Node.js 18+
npm
Git
A CognoDB Cloud account
☁️ CognoDB Setup
Create an account at CognoDB Cloud.
Create a free c0 instance.
Copy the generated database password.
Copy the Bolt connection URI.
Store the credentials in the backend .env file.

Example:

COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password
PORT=5000
Important

Never commit .env to GitHub.

The database password must remain private.

🔐 Environment Variables

Create:

backend/.env

Example:

COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password
PORT=5000

A safe template should be provided as:

backend/.env.example

Example:

COGNODB_URI=
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=
PORT=5000
📦 Backend Installation

Open a terminal:

cd backend
npm install

Start the backend:

npm run dev

The API runs at:

http://localhost:5000
🌱 Seed the Database

After configuring the CognoDB credentials:

cd backend
npm run seed

The seed script creates:

Domains
Skills
Developers
Projects
Developer-skill relationships
Developer-project relationships
Related-skill relationships

Expected output:

Clearing existing database...
Creating domains...
Creating skills...
Creating developers...
Creating projects...
Connecting developers to skills...
Creating developer-project relationships...
Creating related skill relationships...
✅ Database seeded successfully!
🖥️ Frontend Installation

Open another terminal:

cd frontend
npm install

Start the development server:

npm run dev

The frontend runs at:

http://localhost:5173
🔌 API
Health Check
GET /health

Example response:

{
  "status": "healthy",
  "database": "CognoDB connected"
}

If CognoDB is unavailable, the backend returns a 503 response instead of allowing the application to fail silently.

API Root
GET /

Example:

{
  "message": "SkillGraph API is running"
}
🔎 Main Graph Queries
Find Project Recommendations

The application uses parameterized Cypher queries through the official Neo4j JavaScript driver.

Conceptually, the recommendation query follows this graph pattern:

MATCH (d:Developer {name: $developerName})
      -[:HAS_SKILL]->(s:Skill)
      <-[:REQUIRES]-(p:Project)
RETURN
    p.name AS project,
    p.description AS description,
    collect(s.name) AS relevantSkills,
    count(s) AS matchCount
ORDER BY matchCount DESC

The developer name is supplied as a query parameter rather than concatenated directly into the Cypher string.

Multi-Hop Skill Traversal

A multi-hop traversal can follow relationships between related skills:

MATCH (d:Developer {name: $developerName})
      -[:HAS_SKILL]->(s:Skill)
      -[:RELATED_TO]->(related:Skill)
RETURN
    s.name AS skill,
    related.name AS relatedSkill

This demonstrates how the graph can discover information beyond direct relationships.

Explore Graph Relationships

A general graph exploration query:

MATCH (a)-[r]->(b)
RETURN
    labels(a) AS from,
    type(r) AS relationship,
    labels(b) AS to
LIMIT 30

This was used to inspect the graph structure and verify that the database contains the expected nodes and relationships.

🛡️ Error Handling

The backend checks CognoDB connectivity through the /health endpoint.

When the database is unavailable, the API returns:

{
  "status": "unhealthy",
  "database": "CognoDB unavailable"
}

The application therefore provides a graceful failure response rather than exposing a database exception to the user.

🎨 UI / UX

The frontend was designed to make graph-based recommendations understandable to a non-technical user.

The interface includes:

Developer selection
Developer profile information
Current skills
Recommended projects
Matching skill count
Project descriptions
Visual skill tags
Clear recommendation ranking
Loading and error handling

The graph complexity is kept behind the interface so that users can interact with the application without needing to understand Cypher or graph databases.

## Screenshots

### Application Interface

![SkillGraph Application](docs/screenshots/homepage.png)

### Graph-Powered Recommendations

![SkillGraph Recommendations](docs/screenshots/recommendations.png)

🎥 Demo Video



Demo link:
https://skillgraph-frontend-xxxx.onrender.com
🌐 Hosted Demo
https://skillgraph-frontend-qf3d.onrender.com/

The production application will be hosted using free-tier hosting.

Frontend:

https://drive.google.com/file/d/11a5P59eMQC0Dz0hBXw9jvUqk-UYpO5eW/view?usp=drive_link



For the seeded developer Aarav Sharma, SkillGraph produces:

E-Commerce Platform
3 connected skills

Task Management API
2 connected skills

Cloud Deployment Platform
1 connected skill

Developer Analytics Dashboard
1 connected skill

The recommendations are ordered according to the number of matching skills discovered through the graph.

🔒 Security

Sensitive configuration is stored using environment variables.

The following should never be committed:

.env

The repository only contains:

.env.example

with placeholder values.

🚀 Future Improvements

Possible extensions include:

Skill-gap analysis
Personalized learning recommendations
Project similarity scoring
Developer team recommendations
Skill popularity analytics
Graph visualization
Authentication
Role-based access control
AI-assisted project explanations
More advanced multi-hop recommendation algorithms
👩‍💻 Author

Shaik Rumeha Zara

Software Engineering / Full-Stack Developer Candidate

📄 Assignment

This project was developed as a take-home assessment for the:

Software Engineer (Full-Stack / Web) — Wexa AI

The application demonstrates:

Graph data modeling
Cypher queries
Multi-hop graph traversal
Parameterized database queries
Full-stack application architecture
REST API development
React UI development
Error handling
Seed data management
CognoDB integration
