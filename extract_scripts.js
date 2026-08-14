const fs = require('fs');
const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
const scriptRegex = /<script type="module">([\s\S]*?)<\/script>/i;
let match = scriptRegex.exec(html);
if (match) fs.writeFileSync('tmp_student.js', match[1]);
