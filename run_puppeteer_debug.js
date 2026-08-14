const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
app.use(express.static('jaystarbliss-studios.name.ng/htdocs'));
const server = app.listen(0, async () => {
  const port = server.address().port;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.text()));

  await page.evaluateOnNewDocument(() => {
    // Override fetch or something? No, just let Firebase run.
  });

  await page.goto(`http://localhost:${port}/pages/dashboard/staff-portal.html`, { waitUntil: 'networkidle2' });
  
  const resourcesHTML = await page.$eval('#resourcesGrid', el => el.innerHTML).catch(() => 'NOT_FOUND');
  console.log("RESOURCES GRID:", resourcesHTML);
  
  await browser.close();
  server.close();
});
