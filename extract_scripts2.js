const fs = require('fs');
const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let i=0;
while ((match = scriptRegex.exec(html)) !== null) {
  fs.writeFileSync('tmp_student_' + i + '.js', match[1]);
  i++;
}
