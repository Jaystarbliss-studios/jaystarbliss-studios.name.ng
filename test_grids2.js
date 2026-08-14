const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Set localStorage before navigation
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', 'admin@jdh.io');
        localStorage.setItem('userName', 'Admin User');
    });
    
    page.on('console', msg => console.log('LOG:', msg.text()));
    
    await page.goto('http://localhost:3000/pages/dashboard/admin-dashboard.html', {waitUntil: 'networkidle0'});
    await new Promise(r => setTimeout(r, 2000));
    
    const data = await page.evaluate(() => {
        return document.getElementById('schoolExamsGrid')?.innerHTML;
    });
    console.log("schoolExamsGrid HTML:", data);
    
    const data2 = await page.evaluate(() => {
        return document.getElementById('studentResourcesGrid')?.innerHTML;
    });
    console.log("studentResourcesGrid HTML:", data2);
    
    await browser.close();
})();
