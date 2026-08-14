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
    
    // Instead of complex regex, let's just find the exact block and replace it
    const blockStart = "        };\n    document.querySelectorAll('.sidebar-menu .nav-item').forEach(function(n) { n.classList.remove('active'); });";
    const blockEnd = "  }\n\n  document.addEventListener('DOMContentLoaded'";
    
    let idx1 = html.indexOf(blockStart);
    let idx2 = html.indexOf(blockEnd);
    
    if (idx1 !== -1 && idx2 !== -1) {
        html = html.substring(0, idx1 + 10) + "\n\n" + html.substring(idx2 + 4);
    }
    
    fs.writeFileSync(file, html);
}
console.log("Fixed script syntaxes 2");
