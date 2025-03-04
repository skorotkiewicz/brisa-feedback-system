import { navigate, type RequestContext } from "brisa";
import { renderPage } from "brisa/server";
import { prisma } from "@/utils/prisma";
import crypto from "node:crypto";
import { Icons } from "@/utils/icons";

export default async function DashboardPage({}, req: RequestContext) {
  const { token, userId, isAuthenticated } = req.store.get("authContext");

  // Fetch user's projects
  const projects = await prisma.project.findMany({
    where: { userId },
  });

  // Handle new project creation
  async function createProject(e: any) {
    const projectName = e.formData.get("project_name");
    const apiKey = generateApiKey();

    await prisma.project.create({
      data: {
        name: projectName,
        apiKey,
        userId,
      },
    });

    navigate("/dashboard");
  }

  return (
    <div class="container">
      <div class="card mb-4">
        <h2 class="mb-4">Create New Project</h2>
        <form
          // method="POST"
          style={{ maxWidth: "400px" }}
          onSubmit={createProject}
        >
          <div class="form-group">
            <label htmlFor="project_name">Project Name</label>
            <input type="text" id="project_name" name="project_name" required />
          </div>
          <button type="submit" class="btn btn-primary">
            Create Project
          </button>
        </form>
      </div>

      <h2 class="mb-4">Your Projects</h2>
      {projects.map((project) => {
        return (
          <div class="project-card" key={project.id}>
            <div class="project-header">
              <h2 class="project-title">{project.name}</h2>
              <div class="project-actions">
                <a
                  class="btn btn-secondary itemBtn"
                  href={`/project/${project.id}/options`}
                >
                  {Icons(16).Options}
                  Manage Options
                </a>
                <a
                  class="btn btn-secondary itemBtn"
                  href={`/project/${project.id}/theme`}
                >
                  {Icons(16).ChangeTheme}
                  Change Theme
                </a>
                <a
                  href={`/feedback?project_id=${project.id}`}
                  class="btn btn-secondary itemBtn"
                >
                  {Icons(16).Feedback}
                  View Feedback
                </a>
              </div>
            </div>
            <p>
              API Key: <code>{project.apiKey}</code>
            </p>
            <h3>Embed Code</h3>
            <div class="code-block">
              &lt;script
              src="https://your-domain.com/api/widget"&gt;&lt;/script&gt;
              &lt;script&gt; FeedbackWidget.init('
              <span style={{ color: "#ff6" }}>{project.apiKey}</span>');
              &lt;/script&gt;
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to generate API key
function generateApiKey() {
  return crypto.randomBytes(16).toString("hex");
}

// Client-side code would be needed for toggle functions and form submission
// This would be added in a separate client JS file
