import { navigate, type RequestContext } from "brisa";
import { prisma } from "@/utils/prisma";

export default async function ProjectOptionsEdit({}, req: RequestContext) {
  const { token, userId, isAuthenticated } = req.store.get("authContext");

  // Get project ID from URL params
  const projectId = Number.parseInt(req.route.params.id);

  // Fetch project data
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    navigate("/dashboard");
    return null;
  }

  // Handle form submission
  async function saveOptions(e: any) {
    const options = {
      like: e.formData.get("like") === "on",
      suggestion: e.formData.get("suggestion") === "on",
      bug: e.formData.get("bug") === "on",
    };

    // Ensure at least one option is enabled
    if (!options.like && !options.suggestion && !options.bug) {
      options.like = true; // Default to like if nothing selected
    }

    // Save to database
    await prisma.project.update({
      where: { id: projectId },
      data: {
        feedbackOptions: options,
        recaptcha_key: e.formData.get("recaptcha_key") || "",
        recaptcha_secret: e.formData.get("recaptcha_secret") || "",
      },
    });

    // Redirect back to dashboard
    navigate("/dashboard");
  }

  // Handle project deletion
  async function deleteProject() {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    navigate("/dashboard");
  }

  return (
    <div class="container">
      <div class="card mb-4">
        <h2 class="mb-4">Manage Feedback Options for {project.name}</h2>
        <div
          class="button-group"
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
        >
          <a
            href="/dashboard"
            class="btn btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Back to Dashboard
          </a>

          <delete-project
            projectName={project.name}
            onDeleteProject={deleteProject}
          />
        </div>

        <div
          class="options-panel"
          style={{ display: "block", marginTop: "1rem" }}
        >
          <h3>Manage Feedback Options</h3>
          <p class="options-description">
            Choose which feedback options to show in your widget
          </p>
          <form class="options-form" onSubmit={saveOptions}>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  name="like"
                  class="feedback-option-checkbox"
                  checked={project.feedbackOptions.like}
                />
                <span>I like something</span>
              </label>
            </div>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  name="suggestion"
                  class="feedback-option-checkbox"
                  checked={project.feedbackOptions.suggestion}
                />
                <span>I have a suggestion</span>
              </label>
            </div>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  name="bug"
                  class="feedback-option-checkbox"
                  checked={project.feedbackOptions.bug}
                />
                <span>Something's not working</span>
              </label>
            </div>

            <div class="form-group">
              <label>Recaptcha Key</label>
              <input
                type="text"
                name="recaptcha_key"
                value={project.recaptcha_key || ""}
                class="form-control"
                placeholder="Recaptcha Key"
              />
            </div>
            <div class="form-group">
              <label>Recaptcha Secret</label>
              <input
                type="text"
                name="recaptcha_secret"
                value={project.recaptcha_secret || ""}
                class="form-control"
                placeholder="Recaptcha Secret"
              />
            </div>

            <button type="submit" class="btn btn-primary">
              Save Options
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
