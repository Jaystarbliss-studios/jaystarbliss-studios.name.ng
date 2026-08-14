const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('LOG:', msg.text()));
    
    // go to login and login
    await page.goto('http://localhost:3000/pages/auth/login.html', {waitUntil: 'networkidle2'});
    await page.evaluate(() => {
        document.getElementById('email').value = 'admin@jdh.io';
        document.getElementById('password').value = 'password123'; // assuming we can fake it or just set local storage directly
    });
    // Let's just set local storage directly on admin dashboard but fake the indexedDB auth? No, we can't easily.
    // wait, does puppeteer actually preserve firebase auth state? no, it's an empty session.
    // So the grid throws an error because the puppeteer test didn't actually log in via Firebase Auth!
    
    await browser.close();
})();
