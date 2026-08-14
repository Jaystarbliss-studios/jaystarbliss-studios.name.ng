const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_b_admin.js', 'utf8');
code = code.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_b_admin.js', code);
