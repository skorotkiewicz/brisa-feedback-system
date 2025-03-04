import type { RequestContext } from "brisa";
import { Icons } from "@/utils/icons";

export default function Nav({}, req: RequestContext) {
  const { isAuthenticated } = req.store.get("authContext");

  return (
    <aside class="sidebar">
      <div class="sidebar-header">
        <a href="/dashboard" class="logo">
          {Icons(24).Feedback}
          Feedback
        </a>
      </div>

      <div class="sidebar-footer">
        {isAuthenticated ? <MenuNav req={req} /> : <AuthNav req={req} />}
      </div>
    </aside>
  );
}

const MenuNav = ({ req }: { req: RequestContext }) => {
  return (
    <>
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
    </>
  );
};

const AuthNav = ({ req }: { req: RequestContext }) => {
  return (
    <>
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
    </>
  );
};
