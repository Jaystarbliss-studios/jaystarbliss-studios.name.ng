const fs = require('fs');
const esprima = require('esprima');
['phase_b_admin.js', 'phase_a_admin.js'].forEach(file => {
  try {
    const code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/' + file, 'utf8');
    esprima.parseModule(code);
    console.log(file, 'OK');
  } catch (e) {
    console.log(file, 'ERROR:', e.message);
  }
});
