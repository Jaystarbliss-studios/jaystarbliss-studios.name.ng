const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'http://localhost'
});

dom.window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});
dom.window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Rejection:', event.reason);
});

// override console
const oLog = console.log;
dom.window.console.log = (...args) => oLog('[JSDOM LOG]', ...args);
dom.window.console.error = (...args) => oLog('[JSDOM ERROR]', ...args);

setTimeout(() => {
    console.log('Finished waiting');
}, 3000);
