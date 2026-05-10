import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function scrapeHijriWidget() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the page that contains the Hijri calendar widget
    // Update this URL to match your actual source
    await page.goto('https://example.com/hijri-calendar');
    
    // Wait for the widget to load
    await page.waitForSelector('[data-hijri-widget]', { timeout: 10000 }).catch(() => {
      console.log('Widget selector not found, continuing...');
    });
    
    // Get the widget HTML
    const widgetHTML = await page.content();
    
    // Ensure the output directory exists
    const outputDir = path.join(__dirname, '../public/widgets');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the HTML to file
    const outputPath = path.join(outputDir, 'hijri-calendar-uk.html');
    fs.writeFileSync(outputPath, widgetHTML);
    
    console.log(`✓ Hijri calendar widget updated: ${outputPath}`);
  } catch (error) {
    console.error('Error scraping Hijri widget:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

scrapeHijriWidget();
