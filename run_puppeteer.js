const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => {
        console.log('[CONSOLE]', msg.type(), msg.text());
    });
    page.on('pageerror', err => {
        console.log('[PAGE ERROR]', err.message);
    });
    
    await page.goto('http://localhost:3000/pages/dashboard/admin-dashboard.html', {waitUntil: 'networkidle0'});
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
