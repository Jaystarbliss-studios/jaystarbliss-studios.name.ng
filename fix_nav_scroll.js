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
    
    html = html.replace(/<nav([^>]*)class="([^"]*)flex-grow([^"]*)"([^>]*)>/g, '<nav$1class="$2flex-1 min-h-0 overflow-y-auto$3"$4>');
    
    fs.writeFileSync(file, html);
}
console.log("Fixed nav scroll");
