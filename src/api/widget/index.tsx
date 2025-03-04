import { readFileSync } from "node:fs";
import path from "node:path";

export function GET() {
  const widgetPath = path.resolve(process.cwd(), "src/api/widget/widget.js");
  const widgetJS = readFileSync(widgetPath, "utf-8");

  return new Response(widgetJS, {
    headers: {
      "Content-Type": "application/javascript",
      // "Cache-Control": "max-age=3600"
    },
  });
}
