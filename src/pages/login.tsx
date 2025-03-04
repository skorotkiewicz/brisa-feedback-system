import { navigate, type RequestContext } from "brisa";
import { renderPage } from "brisa/server";
import { decodeToken, login } from "@/utils/auth";

export default function LoginPage({}, req: RequestContext) {
  const errorMsg = req.store.get("auth-error");

  async function authenticate(e: any) {
    const email = e.formData.get("email");
    const password = e.formData.get("password");
    const result = await login(email, password);

    if (result) {
      const { token } = JSON.parse(result);

      // Store only token in cookies - userId can be extracted from token when needed
      const tokenCookie = `token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly`;

      // Set single cookie
      req.store.set("auth-cookies", tokenCookie);

      navigate("/dashboard");
      return;
    }

    req.store.set("auth-error", "Invalid credentials");
    renderPage();
  }

  return (
    <div class="container">
      <div class="card" style={{ maxWidth: "400px", margin: "40px auto" }}>
        <h1 class="text-center mb-4">Login</h1>

        {errorMsg && <div class="alert alert-error mb-4">{errorMsg}</div>}

        <form method="POST" onSubmit={authenticate}>
          <div class="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div class="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style={{ width: "100%" }}
          >
            Login
          </button>
        </form>

        <p class="text-center mt-4">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export function responseHeaders(req: RequestContext) {
  // Read the stored auth cookies
  const authCookies = req.store.get("auth-cookies");

  if (authCookies) {
    return {
      "Set-Cookie": authCookies,
    };
  }

  return {};
}
