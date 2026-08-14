const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('userRole', 'parent');
        localStorage.setItem('userEmail', 'parent@example.com');
        localStorage.setItem('userName', 'Test Parent');
        localStorage.setItem('userId', '12345');
        // Let's also mock firebase auth so we don't redirect
    });
    
    // override location.href setter if we can?
    
    await page.goto('http://localhost:3000/pages/dashboard/parent-portal.html', {waitUntil: 'networkidle0'});
    await new Promise(r => setTimeout(r, 1000));
    
    // Switch to progress tab
    const dom = await page.evaluate(() => {
        return document.body.innerHTML.substring(0, 500);
    });
    console.log("DOM START:", dom);
    
    await browser.close();
})();
