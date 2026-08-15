import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  MapPin,
  Sparkles,
  Users,
  AlertCircle,
  Loader2
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [developerProfile, setDeveloperProfile] = useState(null);

  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDevelopers();
  }, []);

  async function fetchDevelopers() {
    try {
      setLoadingDevelopers(true);
      setError("");

      const response = await fetch(`${API_URL}/api/developers`);

      if (!response.ok) {
        throw new Error("Failed to load developers");
      }

      const result = await response.json();

      setDevelopers(result.data);

      if (result.data.length > 0) {
        setSelectedDeveloper(result.data[0].name);
      }
    } catch (err) {
      setError("Unable to connect to SkillGraph. Please try again.");
    } finally {
      setLoadingDevelopers(false);
    }
  }

  async function findRecommendations() {
    if (!selectedDeveloper) return;

    try {
      setLoadingRecommendations(true);
      setError("");

      const [recommendationResponse, profileResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/api/developers/${encodeURIComponent(
              selectedDeveloper
            )}/recommendations`
          ),
          fetch(
            `${API_URL}/api/developers/${encodeURIComponent(
              selectedDeveloper
            )}`
          )
        ]);

      if (!recommendationResponse.ok || !profileResponse.ok) {
        throw new Error("Failed to load developer data");
      }

      const recommendationResult = await recommendationResponse.json();
      const profileResult = await profileResponse.json();

      setRecommendations(recommendationResult.data);
      setDeveloperProfile(profileResult.data);
    } catch (err) {
      setError("Unable to generate recommendations. Please try again.");
    } finally {
      setLoadingRecommendations(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>

          <div>
            <h1>SkillGraph</h1>
            <span>Graph-powered project discovery</span>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          CognoDB Connected
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={15} />
              Intelligent project matching
            </span>

            <h2>
              Find projects that
              <br />
              <span>fit your skills.</span>
            </h2>

            <p>
              SkillGraph uses relationships between developers, skills,
              and projects to discover relevant opportunities.
            </p>

            <div className="selector-card">
              <label>Select a developer</label>

              <div className="selector-row">
                <select
                  value={selectedDeveloper}
                  onChange={(e) => setSelectedDeveloper(e.target.value)}
                  disabled={loadingDevelopers}
                >
                  {loadingDevelopers ? (
                    <option>Loading developers...</option>
                  ) : (
                    developers.map((developer) => (
                      <option
                        key={developer.name}
                        value={developer.name}
                      >
                        {developer.name}
                      </option>
                    ))
                  )}
                </select>

                <button
                  onClick={findRecommendations}
                  disabled={
                    loadingDevelopers ||
                    loadingRecommendations ||
                    !selectedDeveloper
                  }
                >
                  {loadingRecommendations ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      Finding...
                    </>
                  ) : (
                    <>
                      Find Projects
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-box">
            <AlertCircle size={20} />
            <span>{error}</span>

            <button onClick={fetchDevelopers}>
              Retry
            </button>
          </div>
        )}

        {developerProfile && (
          <section className="profile-section">
            <div className="profile-card">
              <div className="avatar">
                {developerProfile.name.charAt(0)}
              </div>

              <div className="profile-info">
                <h3>{developerProfile.name}</h3>

                <div className="profile-meta">
                  <span>
                    <MapPin size={15} />
                    {developerProfile.location}
                  </span>

                  <span>
                    <BriefcaseBusiness size={15} />
                    {developerProfile.experience} years experience
                  </span>
                </div>
              </div>
            </div>

            <div className="skills-card">
              <div className="section-label">
                <Code2 size={17} />
                Current skills
              </div>

              <div className="skill-list">
                {developerProfile.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="recommendations-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Graph insights</span>

              <h2>
                {developerProfile
                  ? `Recommended for ${developerProfile.name}`
                  : "Project recommendations"}
              </h2>
            </div>

            {recommendations.length > 0 && (
              <span className="result-count">
                {recommendations.length} projects found
              </span>
            )}
          </div>

          {loadingRecommendations ? (
            <div className="loading-state">
              <Loader2 size={30} className="spin" />
              <p>Exploring your skill graph...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={26} />
              </div>

              <h3>Discover your project matches</h3>

              <p>
                Select a developer above and let the graph find
                connected projects.
              </p>
            </div>
          ) : (
            <div className="project-grid">
              {recommendations.map((project) => (
                <article
                  className="project-card"
                  key={project.project}
                >
                  <div className="project-top">
                    <div className="project-icon">
                      <BriefcaseBusiness size={21} />
                    </div>

                    <span className="match-badge">
                      {project.matchCount}{" "}
                      {project.matchCount === 1
                        ? "connected skill"
                        : "connected skills"}
                    </span>
                  </div>

                  <h3>{project.project}</h3>

                  <p>{project.description}</p>

                  <div className="project-skills">
                    {project.relevantSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <span>Graph match</span>
                    <ArrowRight size={17} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>SkillGraph</span>
        <span>Powered by CognoDB · Neo4j · Express · React</span>
      </footer>
    </div>
  );
}

export default App;