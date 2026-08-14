const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', 'admin@jdh.io');
        localStorage.setItem('userName', 'Admin User');
    });
    
    page.on('console', msg => console.log('LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.goto('http://localhost:3000/pages/dashboard/admin-dashboard.html', {waitUntil: 'networkidle2'});
    await new Promise(r => setTimeout(r, 4000));
    
    const data = await page.evaluate(() => {
        return document.getElementById('studentResourcesGrid') ? document.getElementById('studentResourcesGrid').innerHTML : 'NULL_ELEMENT';
    });
    console.log("studentResourcesGrid HTML:", data);
    
    await browser.close();
})();
