import { navigate, type RequestContext } from "brisa";
import { Icons } from "@/utils/icons";

import "@/styles/style.css";
import "@/styles/nav.css";
import "@/styles/footer.css";
import "@/styles/feedback.css";

export default function Layout(
  { children }: { children: JSX.Element },
  req: RequestContext,
) {
  const { isAuthenticated } = req.store.get("authContext");

  return (
    <html lang="en">
      <head>
        <title id="title">Feedback App</title>
        <meta name="theme-color" content="#4A90E2" />
        <link rel="shortcut icon" href="/brisa.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div class="dashboard-layout">
          <aside class="sidebar">
            <div class="sidebar-header">
              <a href="/dashboard" class="logo">
                {Icons(24).Feedback}
                Feedback
              </a>
            </div>

            {isAuthenticated ? (
              <div class="sidebar-footer">
                <a
                  href="/dashboard"
                  class={`nav-item ${req.route.name === "/dashboard" ? "active" : ""} `}
                >
                  {Icons(18).Dashboard}
                  Dashboard
                </a>
                <a href="/logout" class="nav-item">
                  {Icons(18).Logout}
                  Logout
                </a>
              </div>
            ) : (
              <div class="sidebar-footer">
                <a
                  href="/login"
                  class={`nav-item ${req.route.name === "/login" ? "active" : ""} `}
                >
                  {Icons(18).Login}
                  Login
                </a>
                <a
                  href="/register"
                  class={`nav-item ${req.route.name === "/register" ? "active" : ""} `}
                >
                  {Icons(18).Register}
                  Register
                </a>
              </div>
            )}
          </aside>

          <main class="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
