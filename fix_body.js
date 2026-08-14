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
    html = html.replace(/<body([^>]*)class="([^"]*)min-h-screen([^"]*)"([^>]*)>/g, '<body$1class="$2h-screen$3"$4>');
    
    // Ensure nav has custom scrollbar styling to make it visible
    if (!html.includes('::-webkit-scrollbar {')) {
       // but maybe it's fine.
    }
    
    // Also scroll main to top on switch tab
    // We can just add it to switchTab if it's missing, but we did that for staff-portal.
    
    fs.writeFileSync(file, html);
}
console.log("Fixed body");
