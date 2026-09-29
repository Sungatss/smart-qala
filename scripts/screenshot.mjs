import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const label = process.argv[2] || 'screenshot';
const outDir = path.resolve('screenshots', label);
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'map', path: '/map' },
  { name: 'ideas', path: '/ideas' },
  { name: 'analytics', path: '/analytics' },
  { name: 'profile', path: '/profile' },
  { name: 'create', path: '/create' },
];

const languages = ['ru', 'kz', 'en'];
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
  console.log(`Taking full matrix screenshots for: ${label}`);

  let count = 0;

  for (const p of pages) {
    for (const v of viewports) {
      await page.setViewport({ width: v.width, height: v.height });

      for (const lang of languages) {
        for (const m of modes) {
          const url = `http://localhost:3000${p.path}`;

          await page.evaluateOnNewDocument((langVal, modeVal) => {
            localStorage.setItem('smart_qala_entered', 'true');
            localStorage.setItem('smart_qala_lang', langVal);
            localStorage.setItem('smart_qala_theme', modeVal === 'dark' ? 'dark' : 'light');
            localStorage.setItem('smart_qala_easy_mode', modeVal === 'easy-mode' ? 'true' : 'false');
          }, lang, m);

          try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
          } catch (e) {
            // Ignore timeout
          }

          await page.evaluate((langVal, modeVal) => {
            localStorage.setItem('smart_qala_entered', 'true');
            localStorage.setItem('smart_qala_lang', langVal);
            localStorage.setItem('smart_qala_theme', modeVal === 'dark' ? 'dark' : 'light');
            localStorage.setItem('smart_qala_easy_mode', modeVal === 'easy-mode' ? 'true' : 'false');

            document.documentElement.classList.remove('dark', 'easy-mode');
            if (modeVal === 'dark') {
              document.documentElement.classList.add('dark');
            } else if (modeVal === 'easy-mode') {
              document.documentElement.classList.add('easy-mode');
            }
          }, lang, m);

          // Small pause for layout/Leaflet
          await new Promise((r) => setTimeout(r, 250));

          const fileName = `${p.name}_${lang}_${m}_${v.label}.png`;
          const filePath = path.join(outDir, fileName);
          await page.screenshot({ path: filePath, fullPage: false });
          count++;
          if (count % 18 === 0 || count === 108) {
            console.log(`✓ Progress: ${count}/108 screenshots captured (latest: ${fileName})`);
          }
        }
      }
    }
  }

  await browser.close();
  console.log(`Successfully completed: ${count} screenshots captured in: ${outDir}`);
}

main().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
