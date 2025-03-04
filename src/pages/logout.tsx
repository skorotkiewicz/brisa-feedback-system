import { navigate, type RequestContext } from "brisa";

export default function LogoutPage({}, req: RequestContext) {
  // Only need to expire the token cookie
  const tokenCookie = "token=deleted; Path=/; Max-Age=0; HttpOnly";

  // Set single cookie to expire
  req.store.set("auth-cookies", tokenCookie);

  // Redirect to login page
  navigate("/login");
  return;
}

export function responseHeaders(req: RequestContext) {
  // Read the stored auth cookies for clearing
  const authCookies = req.store.get("auth-cookies");

  if (authCookies) {
    return {
      "Set-Cookie": authCookies,
    };
  }

  return {};
}
