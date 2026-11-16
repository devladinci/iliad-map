// Walks through every scene of every book in both languages and fails on any page error.
// Needs the dev server running. Usage: node scripts/smoke.mjs
import puppeteer from 'puppeteer-core';
const base = process.env.SHOT_URL || 'http://localhost:5173/';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const problems = [];
for (const lang of ['bg', 'en']) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => { localStorage.setItem('iliad.progress', '25'); });
  page.on('pageerror', e => problems.push(`${lang}: ${e}`));
  page.on('console', m => { if (m.type() === 'error') problems.push(`${lang} console: ${m.text()}`); });
  await page.goto(`${base}#l=${lang}&b=1&s=1`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => window.iliadMap && document.querySelector('.stepper'), { timeout: 20000 });
  let steps = 0, empty = 0;
  for (;;) {
    const state = await page.evaluate(() => ({ hash: location.hash, title: document.querySelector('.scene h3')?.textContent || '', text: document.querySelector('.scene p')?.textContent || '', next: !!document.querySelector('.stepper .btn.primary') }));
    if (!state.title || state.text.length < 40) { empty++; problems.push(`${lang}: thin scene at ${state.hash}`); }
    steps++;
    if (/b=24&s=9/.test(state.hash) || steps > 260) break;
    await page.evaluate(() => { const b = document.querySelector('.stepper .btn.primary'); b && b.click(); });
    await new Promise(r => setTimeout(r, 60));
    // moving on to the next book lands on its overview: start its first scene
    await page.evaluate(() => { if (!document.querySelector('.scene')) { const s = document.querySelector('.actions .btn.primary'); s && s.click(); } });
    await new Promise(r => setTimeout(r, 60));
  }
  console.log(lang, 'scenes visited:', steps, 'thin:', empty, 'ended at', await page.evaluate(() => location.hash));
  await page.close();
}
await browser.close();
for (const p of problems.slice(0, 20)) console.log('PROBLEM', p);
console.log(problems.length ? `${problems.length} problems` : 'no problems');
process.exit(problems.length ? 1 : 0);
