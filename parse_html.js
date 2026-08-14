const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;
console.log('schoolExamsGrid exists?', !!document.getElementById('schoolExamsGrid'));
console.log('newsGrid exists?', !!document.getElementById('newsGrid'));
console.log('studentResourcesGrid exists?', !!document.getElementById('studentResourcesGrid'));
