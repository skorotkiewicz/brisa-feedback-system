import type { RequestContext } from "brisa";
import { userAuth } from "./utils/cookies";

export default async function middleware(req: RequestContext) {
  if (!req.route || req.route.name.startsWith("/api/")) return;

  if (
    // req.route.name === "/" ||
    req.url.includes("/login") ||
    req.url.includes("/register") ||
    req.url.includes("/public/")
  ) {
    setAuth(null, req);

    return undefined;
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const user = userAuth(cookieHeader);

  if (!user?.token || !user?.userId) {
    setAuth(user, req);

    return new Response("", {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }

  setAuth(user, req);

  return undefined;
}

const setAuth = (
  user: { token: string; userId: number } | null,
  req: RequestContext,
) => {
  return req.store.set("authContext", {
    userId: user ? user.userId : null,
    token: user ? user.token : null,
    isAuthenticated: !!user,
  });
};
