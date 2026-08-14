const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Disable navigation so we can stay on the page
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().includes('login.html')) {
            request.abort();
        } else {
            request.continue();
        }
    });
    
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem('userRole', 'parent');
        localStorage.setItem('userEmail', 'parent@example.com');
        localStorage.setItem('userName', 'Test Parent');
        localStorage.setItem('userId', '12345');
    });
    
    page.on('console', msg => console.log('LOG:', msg.text()));
    
    await page.goto('http://localhost:3000/pages/dashboard/parent-portal.html', {waitUntil: 'networkidle2'});
    await new Promise(r => setTimeout(r, 2000));
    
    // Switch to progress tab
    await page.evaluate(() => {
        if (window.switchTab) window.switchTab('progress');
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    const data = await page.evaluate(() => {
        return {
            progressActive: document.getElementById('tab-progress')?.classList.contains('active'),
            overviewActive: document.getElementById('tab-overview')?.classList.contains('active'),
            nameDisplay: document.getElementById('topNavNameDisplay')?.textContent
        };
    });
    console.log("PARENT STATE:", data);
    
    await browser.close();
})();
