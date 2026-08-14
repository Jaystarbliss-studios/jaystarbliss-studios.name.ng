const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  console.log('HTML length:', (await page.evaluate(() => document.body.innerHTML)).length);
  console.log(html);
  await browser.close();
})();
