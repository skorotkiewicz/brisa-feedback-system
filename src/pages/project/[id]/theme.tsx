import { navigate, type RequestContext } from "brisa";
import { prisma } from "@/utils/prisma";
import { themes } from "@/utils/themes";

export default async function ProjectThemeEdit({}, req: RequestContext) {
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

  // Parse settings with defaults
  const settings = {
    theme: "classic",
    buttonText: "Feedback",
    headerText: "Help us improve",
    ...JSON.parse(JSON.stringify(project.widgetSettings || {})),
  };

  // Handle form submission
  async function saveTheme(e: any) {
    const updatedSettings = {
      // theme: e.formData.get("theme"),
      theme: req.store.get("newTheme"),
      buttonText: e.formData.get("buttonText"),
      headerText: e.formData.get("headerText"),
    };

    // Add theme properties based on selected theme
    const themeName = updatedSettings.theme;
    if (themes[themeName]) {
      Object.assign(updatedSettings, themes[themeName]);
    }

    // Save to database
    const data = await prisma.project.update({
      where: { id: projectId },
      data: {
        widgetSettings: updatedSettings,
      },
    });

    // Redirect back to dashboard
    navigate("/dashboard");
  }

  return (
    <div class="container">
      <div class="card mb-4">
        <h2 class="mb-4">Customize Theme for {project.name}</h2>
        <a
          href="/dashboard"
          class="btn btn-secondary"
          style={{ textDecoration: "none" }}
        >
          Back to Dashboard
        </a>

        <div
          class="customization-panel"
          style={{ display: "block", marginTop: "1rem" }}
        >
          <form class="customization-form" onSubmit={saveTheme}>
            <div class="customization-section">
              <h4>Text Settings</h4>
              <div class="form-group">
                <label>Feedback Button Text</label>
                <input
                  type="text"
                  name="buttonText"
                  value={settings.buttonText}
                  class="form-control"
                  placeholder="e.g., Feedback, Help, Support"
                />
              </div>
              <div class="form-group">
                <label>Widget Header Text</label>
                <input
                  type="text"
                  name="headerText"
                  value={settings.headerText}
                  class="form-control"
                  placeholder="e.g., Help us improve, Send feedback"
                />
              </div>
            </div>

            <change-theme themes={themes} currentTheme={settings.theme} />

            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
