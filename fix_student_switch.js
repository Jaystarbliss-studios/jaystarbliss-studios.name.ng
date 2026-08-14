const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

html = html.replace(/document\.querySelector\('\.main'\)\.scrollTo\(0,0\);/g, "document.querySelector('main')?.scrollTo(0,0);");

// And also line 224 switchTab override:
html = html.replace(/if\(pane\) pane\.classList\.add\('active'\);/g, "if(pane) pane.classList.add('active');\n            document.querySelector('main')?.scrollTo(0, 0);");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
console.log("Fixed student switchTab");
