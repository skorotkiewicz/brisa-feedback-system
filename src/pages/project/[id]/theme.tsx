import { navigate, type RequestContext } from "brisa";
import { prisma } from "@/utils/prisma";
import { Icons } from "@/utils/icons";

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

  // Available themes
  const themes = {
    classic: {
      primaryColor: "#4A90E2",
      buttonTextColor: "#FFFFFF",
      backgroundColor: "#FFFFFF",
      widgetTextColor: "#333333",
      widgetButtonColor: "#4A90E2",
      widgetButtonTextColor: "#FFFFFF",
    },
    modern: {
      primaryColor: "#6C5CE7",
      buttonTextColor: "#FFFFFF",
      backgroundColor: "#F3F0FF",
      widgetTextColor: "#2D3436",
      widgetButtonColor: "#6C5CE7",
      widgetButtonTextColor: "#FFFFFF",
    },
    dark: {
      primaryColor: "#2D3436",
      buttonTextColor: "#FFFFFF",
      backgroundColor: "#2D3436",
      widgetTextColor: "#FFFFFF",
      widgetButtonColor: "#636E72",
      widgetButtonTextColor: "#FFFFFF",
    },
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
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <a href="/dashboard" class="logo">
            {Icons(24).Feedback}
            Feedback
          </a>
        </div>

        <div class="sidebar-footer">
          <a href="/dashboard" class="nav-item">
            {Icons(18).Dashboard}
            Dashboard
          </a>
          <a href="/logout" class="nav-item">
            {Icons(18).Logout}
            Logout
          </a>
        </div>
      </aside>

      <main class="main-content">
        <div class="container">
          <div class="card mb-4">
            <h2 class="mb-4">Customize Theme for {project.name}</h2>
            <a href="/dashboard" class="btn btn-secondary">
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
      </main>
    </div>
  );
}
