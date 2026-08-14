const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

code = code.replace(/allGrid\.innerHTML = all[A-Za-z]+\.map\(fmtCard\)\.join\(''\);/g, `$& setTimeout(() => lucide.createIcons(), 0);`);
code = code.replace(/recentList\.innerHTML = [\s\S]*?join\(''\);/g, `$& setTimeout(() => lucide.createIcons(), 0);`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', code);
