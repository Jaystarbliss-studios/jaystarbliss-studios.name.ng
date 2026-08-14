const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

console.log(document.getElementById('tab-children').innerHTML);
