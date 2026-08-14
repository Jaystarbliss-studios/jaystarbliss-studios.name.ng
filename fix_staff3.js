const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

// I might have deleted "};" so let's add it back.
// But first, let's restore it and then fix it properly.
// I can just search for "if(pane) pane.classList.add('active');" 
// and ensure it ends with "};" and nothing else until "/* ─── Notifications ─── */"

const regex3 = /if\(pane\) pane\.classList\.add\('active'\);[\s\S]*?\/\* ─── Notifications ─── \*\//;

html = html.replace(regex3, "if(pane) pane.classList.add('active');\n        };\n  /* ─── Notifications ─── */");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', html);
console.log("Fixed staff portal properly 3");
