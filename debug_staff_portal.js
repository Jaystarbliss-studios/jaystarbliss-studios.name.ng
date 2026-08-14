const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

html = html.replace('<script type="module">', '<script type="module">\nconsole.log("[DEBUG] Module started in staff-portal");\n');

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', html);
