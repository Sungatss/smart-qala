import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots', 'ui-auth');
fs.mkdirSync(outDir, { recursive: true });

const languages = ['kz', 'ru', 'en'];
const modes = ['light', 'dark', 'easy-mode'];
const views = ['resident', 'staff', 'demo-open'];

const viewports = [
  { width: 1440, height: 900, label: '1440px' },
  { width: 375, height: 812, label: '375px' },
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  console.log('Capturing auth screenshots: 1440px & 375px, 3 themes, 3 languages, 3 views');

  let count = 0;
  const total = viewports.length * languages.length * modes.length * views.length;

  for (const v of viewports) {
    await page.setViewport({ width: v.width, height: v.height });

    for (const lang of languages) {
      for (const m of modes) {
        for (const view of views) {
          const url = 'http://localhost:3000/';

          // Ensure hasEnteredSite is false so AuthGate is displayed
          await page.evaluateOnNewDocument((langVal, modeVal) => {
            localStorage.setItem('smart_qala_entered', 'false');
            localStorage.setItem('smart_qala_lang', langVal);
            localStorage.setItem('smart_qala_theme', modeVal === 'dark' ? 'dark' : 'light');
            localStorage.setItem('smart_qala_easy_mode', modeVal === 'easy-mode' ? 'true' : 'false');
          }, lang, m);

          try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
          } catch (e) {
            // ignore timeout
          }

          await page.evaluate((langVal, modeVal) => {
            localStorage.setItem('smart_qala_entered', 'false');
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

          await new Promise((r) => setTimeout(r, 200));

          // If view is 'staff', click the button to switch to staff view
          if (view === 'staff') {
            await page.evaluate(() => {
              // Click the button containing the link to staff
              const buttons = Array.from(document.querySelectorAll('button'));
              const staffBtn = buttons.find((b) =>
                b.textContent &&
                (b.textContent.includes('сотрудников') ||
                  b.textContent.includes('қызметкерлер') ||
                  b.textContent.includes('municipal staff'))
              );
              if (staffBtn) staffBtn.click();
            });
            await new Promise((r) => setTimeout(r, 250));
          } else if (view === 'demo-open') {
            await page.evaluate(() => {
              // Click the demo accounts collapsible trigger button
              const buttons = Array.from(document.querySelectorAll('button'));
              const demoBtn = buttons.find((b) =>
                b.textContent &&
                (b.textContent.includes('Демо-аккаунты') ||
                  b.textContent.includes('демо-есептік') ||
                  b.textContent.includes('Demo accounts'))
              );
              if (demoBtn) demoBtn.click();
            });
            await new Promise((r) => setTimeout(r, 250));
          }

          const fileName = `auth_${view}_${lang}_${m}_${v.label}.png`;
          const filePath = path.join(outDir, fileName);
          await page.screenshot({ path: filePath, fullPage: false });
          count++;

          if (count % 9 === 0 || count === total) {
            console.log(`✓ Progress: ${count}/${total} captures (latest: ${fileName})`);
          }
        }
      }
    }
  }

  await browser.close();
  console.log(`Auth screenshots completed! All ${count} images saved in ${outDir}`);
}

main().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
