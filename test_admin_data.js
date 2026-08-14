const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Mock tailwind
html = html.replace('<script id="tailwind-config">', '<script id="tailwind-config">window.tailwind = { config: {} };');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'http://localhost'
});

// override console
const oLog = console.log;
dom.window.console.log = (...args) => oLog('[JSDOM LOG]', ...args);
dom.window.console.error = (...args) => oLog('[JSDOM ERROR]', ...args);

setTimeout(() => {
    console.log('DOM Content Resources Grid:', dom.window.document.getElementById('resourcesGrid')?.innerHTML);
    console.log('DOM Content Students Grid:', dom.window.document.getElementById('studentsListContainer')?.innerHTML);
}, 4000);
