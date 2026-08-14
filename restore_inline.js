const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
let script = fs.readFileSync('tmp_student.mjs', 'utf8');
html = html.replace(/<script type="module" src="tmp_student.mjs"><\/script>/, `<script type="module">\n${script}\n</script>`);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
