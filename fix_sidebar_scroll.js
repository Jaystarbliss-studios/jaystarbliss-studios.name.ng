const fs = require('fs');
const glob = require('fs').readdirSync; // not quite glob but let's just list the files
const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html'
];

for(const file of files) {
    if(!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    
    // Remove overflow-y-auto from aside, add overflow-hidden
    html = html.replace(/<aside([^>]+)overflow-y-auto([^>]*)>/, '<aside$1overflow-hidden$2>');
    
    // Add overflow-y-auto to nav
    html = html.replace(/<nav([^>]+class="[^"]*sidebar-menu[^"]*")([^>]*)>/, '<nav$1 style="overflow-y:auto; padding-right:5px;"$2>');
    
    fs.writeFileSync(file, html);
}
console.log("Fixed sidebar scrolling");
