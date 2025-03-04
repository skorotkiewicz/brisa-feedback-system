import { navigate, type RequestContext } from "brisa";

export default function Home({}, req: RequestContext) {
  // // Redirect to dashboard if logged in, otherwise to login page

  const { token, userId, isAuthenticated } = req.store.get("authContext");
  if (isAuthenticated) {
    navigate("/dashboard");
  } else {
    navigate("/login");
  }

  return (
    <div class="hero">
      <h1>Feedback System</h1>
      <p>Collect and manage feedback from your users</p>
      <div class="action-buttons">
        <a href="/login" class="btn btn-primary">
          Login
        </a>
        <a href="/register" class="btn btn-secondary">
          Register
        </a>
      </div>
    </div>
  );
}
