import { navigate, type RequestContext } from "brisa";

export default function LogoutPage({}, req: RequestContext) {
  // Redirect to login page
  navigate("/login");
  return;
}

export function responseHeaders() {
  return {
    "Set-Cookie": "token=deleted; Path=/; Max-Age=0; HttpOnly",
  };
}
