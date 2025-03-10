import type { RequestContext } from "brisa";
import { prisma } from "@/utils/prisma";
import { addCorsHeaders } from "@/utils/response";

export async function GET(req: RequestContext) {
  const apiKey = String(req.route.query?.api_key || "");

  if (!apiKey) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "API key is required" }), {
        status: 400,
      }),
    );
  }

  const project = await prisma.project.findFirst({
    where: { apiKey },
  });

  if (!project) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      }),
    );
  }

  // Parse widget settings and feedback options with defaults
  const settings = {
    ...JSON.parse(JSON.stringify(project.widgetSettings || {})),
    feedbackOptions: JSON.parse(JSON.stringify(project.feedbackOptions || {})),
    recaptcha_enabled: project.recaptcha_enabled || false,
    recaptcha_key: project.recaptcha_key || "",
  };

  return addCorsHeaders(
    new Response(JSON.stringify(settings), { status: 200 }),
  );
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return addCorsHeaders(new Response(null, { status: 204 }));
}
