const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

code = code.replace(/document\.getElementById\('notifToggleBtn'\)\.addEventListener/g, "document.getElementById('notifToggleBtn')?.addEventListener");
code = code.replace(/document\.getElementById\('notifCloseBtn'\)\.addEventListener/g, "document.getElementById('notifCloseBtn')?.addEventListener");
code = code.replace(/document\.getElementById\('sidebarLogoutBtn'\)\.addEventListener/g, "document.getElementById('sidebarLogoutBtn')?.addEventListener");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', code);
