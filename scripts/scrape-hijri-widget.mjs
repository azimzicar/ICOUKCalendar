import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const TARGET_URL = "https://www.moonsighting.org.uk/";
const OUTPUT_PATH = path.join(process.cwd(), "public", "widgets", "hijri-calendar-uk.html");

// Stable: find the card that has the header text
const CARD_LOCATOR = 'div.card:has(h3:has-text("Hijri Calendar (UK)"))';

function wrapAsStandaloneHtml(widgetOuterHtml) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hijri Calendar (UK)</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .card { border: 1px solid #e6e6e6; border-radius: 12px; overflow: hidden; background: #fff; }
    .card-header { margin: 0; padding: 10px 12px; font-size: 14px; background: #f6f7fb; border-bottom: 1px solid #e6e6e6; }
    .card-body { padding: 10px; }
  </style>
</head>
<body>
  ${widgetOuterHtml}
</body>
</html>`;
}

async function main() {
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 450, height: 900 },
    deviceScaleFactor: 2
  });

  await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 60000 });

  const card = page.locator(CARD_LOCATOR).first();
  await card.waitFor({ state: "visible", timeout: 30000 });

  const widgetOuterHtml = await card.evaluate(el => el.outerHTML);

  await browser.close();

  const finalHtml = wrapAsStandaloneHtml(widgetOuterHtml);
  await fs.writeFile(OUTPUT_PATH, finalHtml, "utf8");

  console.log("Saved:", OUTPUT_PATH);
}

main().catch(err => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
