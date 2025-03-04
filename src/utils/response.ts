// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const send = (status: number, data: any) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
};

export const addCorsHeaders = (response: Response) => {
  const headers = new Headers(response.headers);

  headers.set("Content-Type", "application/json");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
