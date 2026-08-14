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
        return {
            schoolExams: document.getElementById('schoolExamsGrid')?.innerHTML,
            schoolResources: document.getElementById('schoolResourcesGrid')?.innerHTML,
            news: document.getElementById('newsGrid')?.innerHTML,
            studentResources: document.getElementById('studentResourcesGrid')?.innerHTML,
            students: document.getElementById('studentsListContainer')?.innerHTML
        };
    });
    console.log("GRIDS HTML:", JSON.stringify(data, null, 2));
    await browser.close();
})();
