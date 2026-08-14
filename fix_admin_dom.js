const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(/document\.getElementById\('themeToggleBtn'\)\.addEventListener\('click', toggleTheme\);/g, "const tb = document.getElementById('themeToggleBtn'); if(tb) tb.addEventListener('click', toggleTheme);");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed DOM content loaded error");
