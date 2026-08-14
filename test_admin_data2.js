const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

// Mock tailwind
html = html.replace('<script id="tailwind-config">', '<script id="tailwind-config">window.tailwind = { config: {} };');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'http://localhost',
  resources: "usable"
});

// override console
const oLog = console.log;
dom.window.console.log = (...args) => oLog('[JSDOM LOG]', ...args);
dom.window.console.error = (...args) => oLog('[JSDOM ERROR]', ...args);

setTimeout(() => {
    console.log('Finished waiting');
}, 5000);
