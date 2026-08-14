const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(/console\.error\(e\);/g, "console.error(e); grid ? (grid.innerHTML = '<pre>' + e.stack + '</pre>') : (container.innerHTML = '<pre>' + e.stack + '</pre>');");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Added stack traces to admin UI");
