import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const label = process.argv[2] || 'screenshot';
const outDir = path.resolve('screenshots', label);
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'map', path: '/map' },
  { name: 'analytics', path: '/analytics' }
];

const modes = ['light', 'dark', 'easy-mode'];

const viewports = [
  { width: 1440, height: 900, label: '1440px' },
  { width: 375, height: 812, label: '375px' }
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  console.log(`Taking screenshots for: ${label}`);

  for (const p of pages) {
    for (const v of viewports) {
      await page.setViewport({ width: v.width, height: v.height });

      for (const m of modes) {
        const url = `http://localhost:3000${p.path}`;
        
        // Setup initial storage before navigation
        await page.evaluateOnNewDocument((mode) => {
          localStorage.setItem('smart_qala_entered', 'true');
          localStorage.setItem('smart_qala_theme', mode === 'dark' ? 'dark' : 'light');
          localStorage.setItem('smart_qala_easy_mode', mode === 'easy-mode' ? 'true' : 'false');
        }, m);

        try {
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        } catch (e) {
          // If timeout on network idle (e.g. leaflet tiles or polling), still proceed
        }

        // Ensure classes are applied directly
        await page.evaluate((mode) => {
          document.documentElement.classList.remove('dark', 'easy-mode');
          if (mode === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (mode === 'easy-mode') {
            document.documentElement.classList.add('easy-mode');
          }
        }, m);

        // Wait a small moment for CSS transitions and canvas/map tiles
        await new Promise((r) => setTimeout(r, 600));

        const fileName = `${p.name}_${m}_${v.label}.png`;
        const filePath = path.join(outDir, fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`✓ Saved: ${filePath}`);
      }
    }
  }

  await browser.close();
  console.log(`All 18 screenshots successfully captured in: ${outDir}`);
}

main().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
