import { navigate } from "brisa";
import type { RequestContext, ResponseHeaders } from "brisa";

export default function LogoutPage({}, req: RequestContext) {
  // Redirect to login page
  navigate("/login");
  return;
}

export function responseHeaders(
  request: RequestContext,
  { headersSnapshot }: ResponseHeaders,
) {
  const headers = headersSnapshot();

  headers.append("Set-Cookie", "token=deleted; Path=/; Max-Age=0; HttpOnly");
  return headers;
}
