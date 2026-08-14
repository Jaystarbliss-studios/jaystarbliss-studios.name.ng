const fs = require('fs');
const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html'
];

for(const file of files) {
    if(!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    
    // Find the part starting from "        };" and ending at "  }\n\n  document.addEventListener('DOMContentLoaded'" or similar.
    let re = /};\s*document\.querySelectorAll\('\.sidebar-menu \.nav-item'\)[\s\S]*?navEl\.classList\.add\('active'\);\s*\}\s*document\.addEventListener\('DOMContentLoaded'/;
    
    html = html.replace(re, "};\n\n  document.addEventListener('DOMContentLoaded'");
    
    fs.writeFileSync(file, html);
}
console.log("Fixed script syntaxes 3");
