import { type RequestContext } from "brisa";
import { userAuth } from "@/utils/cookies";
import { prisma } from "@/utils/prisma";
import { addCorsHeaders } from "@/utils/response";

export async function POST(req: RequestContext) {
  // Auth check
  const cookieHeader = req.headers.get("cookie") || "";
  const user = userAuth(cookieHeader);

  const token = user?.token;
  const userId = user?.userId;

  if (!token || !userId) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    );
  }

  const data = await req.json();
  const projectId = data.project_id;
  const settings = data.settings;
  const updateType = data.updateType;

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      }),
    );
  }

  try {
    if (updateType === "theme") {
      // Update theme settings
      await prisma.project.update({
        where: { id: projectId },
        data: {
          widgetSettings: settings,
        },
      });
    } else if (updateType === "options") {
      // Update feedback options
      await prisma.project.update({
        where: { id: projectId },
        data: {
          feedbackOptions: settings.feedbackOptions,
        },
      });
    }

    return addCorsHeaders(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
  } catch (error) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Failed to save settings" }), {
        status: 500,
      }),
    );
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new Response(null, { status: 204 }));
}
