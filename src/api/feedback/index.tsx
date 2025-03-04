import type { RequestContext } from "brisa";
import { prisma } from "@/utils/prisma";
import { FeedbackStatus } from "@prisma/client";
import { addCorsHeaders } from "@/utils/response";
import axios from "axios";

// const CAPTCHA_SECRET_KEY = Bun.env.CAPTCHA_SECRET_KEY;
// const CAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY;

export async function POST(req: RequestContext) {
  const data = await req.json();
  const apiKey = data.api_key;
  const captcha = data.recaptcha_token;

  // Verify API key and get project
  const project = await prisma.project.findFirst({
    where: { apiKey },
  });

  if (!project) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 401,
      }),
    );
  }

  if (!captcha) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Please complete the CAPTCHA" }), {
        status: 401,
      }),
    );
  }

  //
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${project.recaptcha_secret}&response=${captcha}`,
    );
    if (response.data.success) {
      // Save feedback
      await prisma.feedback.create({
        data: {
          projectId: project.id,
          type: data.type,
          message: data.message,
          email: data.email,
          pageUrl: data.page_url,
          status: FeedbackStatus.PENDING,
        },
      });

      return addCorsHeaders(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
      //
    }
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "CAPTCHA verification error" }), {
        status: 401,
      }),
    );
  } catch (error) {
    return addCorsHeaders(
      new Response(JSON.stringify({ error: "Failed to save feedback" }), {
        status: 500,
      }),
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return addCorsHeaders(new Response(null, { status: 204 }));
}
