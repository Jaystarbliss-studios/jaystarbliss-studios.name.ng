const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
html = html.replace(/collection\(db, 'individualStudents'\)/g, "collection(db, 'students')");
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
console.log("Fixed student portal individualStudents to students");
