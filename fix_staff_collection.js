const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

html = html.replace(/collection\(db, 'individualStudents'\)/g, "collection(db, 'students')");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', html);
console.log("Fixed staff individualStudents");
