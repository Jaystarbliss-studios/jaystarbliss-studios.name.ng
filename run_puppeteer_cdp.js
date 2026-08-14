const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
app.use(express.static('jaystarbliss-studios.name.ng/htdocs'));
const server = app.listen(0, async () => {
  const port = server.address().port;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const client = await page.target().createCDPSession();
  await client.send('Runtime.enable');
  client.on('Runtime.exceptionThrown', exception => {
    console.log('[EXCEPTION]', JSON.stringify(exception.exceptionDetails, null, 2));
  });

  page.on('console', msg => console.log('[CONSOLE]', msg.text()));

  await page.goto(`http://localhost:${port}/pages/dashboard/admin-dashboard.html`);
  await new Promise(r => setTimeout(r, 2000));
  
  const resourcesHTML = await page.$eval('#resourcesGrid', el => el.innerHTML).catch(() => 'NOT_FOUND');
  console.log("RESOURCES GRID:", resourcesHTML.substring(0, 200));

  await browser.close();
  server.close();
});
