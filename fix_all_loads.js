const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const functionsToFix = [
  'loadStudentsList',
  'loadStaffList',
  'loadResources',
  'loadLinks',
  'loadExams',
  'loadLogs',
  'loadSchoolExams',
  'loadSchoolResources',
  'loadNewsCorner',
  'loadPayments'
];

functionsToFix.forEach(fn => {
  const regex = new RegExp(`async function ${fn}\\(\\) \\{`);
  html = html.replace(regex, `async function ${fn}() { if(typeof auth !== "undefined") await auth.authStateReady();`);
});

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed all load functions to await authStateReady");
