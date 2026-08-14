const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tmp_student.mjs', 'utf8');
let lines = code.split('\n');
for (let i = 1; i <= lines.length; i++) {
   try {
     new Function(lines.slice(0, i).join('\n'));
   } catch (e) {
     if (e.message.includes('Invalid or unexpected token')) {
         console.log('Error at line', i);
         console.log(lines[i-1]);
         process.exit(0);
     }
   }
}
