const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

// The problematic block starts with "        };" and ends with "  }\n  /* ─── Notifications ─── */"
const regex = /\s*};\s*\/\* ─── Activate matching bottom nav item.*?(?=  \/\* ─── Notifications ─── \*\/)/s;

// We need to match from "        };\n            // Activate matching"
const regex2 = /\s*};\s*\/\/ Activate matching bottom nav item[\s\S]*?document\.querySelector\('\.main'\)\.scrollTop = 0;\s*\}/;

html = html.replace(regex2, '');

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', html);
console.log("Fixed staff portal properly");
