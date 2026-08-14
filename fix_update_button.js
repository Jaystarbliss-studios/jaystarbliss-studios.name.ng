const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(
  /<button class="px-3 py-1\.5 text-xs font-semibold bg-primary text-on-primary rounded-md hover:bg-primary\/90 transition-colors" onclick="updateStudentCode\('\$\{docSnap\.id\}'\)">Update Code<\/button>/g,
  '<button class="px-3 py-1.5 text-xs font-semibold bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap" onclick="updateStudentCode(\'${docSnap.id}\')">Update Code</button>'
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
