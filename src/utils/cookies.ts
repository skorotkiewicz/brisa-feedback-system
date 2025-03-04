// Function to parse cookies from cookie string
export function parseCookieString(cookieStr: string) {
  if (!cookieStr) return {};

  return cookieStr
    .split(";")
    .reduce((cookies: { [key: string]: string }, cookie) => {
      const [name, value] = cookie
        .trim()
        .split("=")
        .map((c) => c.trim());
      if (name && value) cookies[name] = value;
      return cookies;
    }, {});
}

export const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    // Decode base64
    const decoded = Buffer.from(payload, "base64").toString();
    const decodedPayload = JSON.parse(decoded);
    // Get userId from token
    const userId = decodedPayload.userId || 0;
    return Number.parseInt(userId);
  } catch (error) {
    return null;
  }
};

export function userAuth(cookie: string) {
  const cookies = parseCookieString(cookie);

  const token: string = cookies.token;
  const userId: number = decodeToken(token) ?? 0;

  if (!token || !userId) return null;

  return { token, userId };
}

// const cookieHeader = request.headers.get("cookie") || "";
// const user = userAuth(cookieHeader);

// const token = user?.token;
// const userId = user?.userId;

//   if (!token || !userId) {
//     navigate("/login");
//     return null;
//   }
