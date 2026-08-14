const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
let script = fs.readFileSync('tmp_student.mjs', 'utf8');
html = html.replace(/<\/body>/, `<script type="module">\n${script}\n</script>\n</body>`);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
