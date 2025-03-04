import { readFileSync } from "node:fs";
import path from "node:path";
import { minify } from "terser";

export async function GET() {
  const widgetPath = path.resolve(process.cwd(), "src/api/widget/widget.js");
  const widgetJS = readFileSync(widgetPath, "utf-8");

  // Minifikacja kodu
  const minifiedJS = await minify(widgetJS);

  return new Response(minifiedJS.code, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "max-age=3600",
    },
  });
}
