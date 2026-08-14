const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(/if\(pane\) pane\.classList\.add\('active'\);/g, "if(pane) pane.classList.add('active');\n        document.querySelector('main')?.scrollTo(0, 0);");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed admin switchTab");
