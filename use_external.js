const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
html = html.replace(/<script type="module">([\s\S]*?)<\/script>/, '<script type="module" src="tmp_student.mjs"></script>');
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
fs.copyFileSync('tmp_student.mjs', 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tmp_student.mjs');
