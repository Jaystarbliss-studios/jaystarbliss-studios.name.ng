const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_c_student.js', 'utf8');
let lines = code.split('\n');
for (let i = 1; i <= lines.length; i++) {
   try {
     require('acorn').parse(lines.slice(0, i).join('\n'), { ecmaVersion: 2022, sourceType: 'module' });
   } catch (e) {
     if (e.message.includes('Unexpected identifier')) {
         console.log('Error at line', i);
         console.log(lines[i-1]);
         process.exit(0);
     }
   }
}
