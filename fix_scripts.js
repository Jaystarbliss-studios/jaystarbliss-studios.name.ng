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
    
    // Replace the mangled part
    const regex1 = /};\s*document\.querySelectorAll\('\.sidebar-menu \.nav-item'\)\.forEach\(function\(n\) \{ n\.classList\.remove\('active'\); \}\);\s*var tabEl = document\.getElementById\(tabName\);\s*if \(tabEl\) tabEl\.classList\.add\('active'\);\s*var navEl = document\.querySelector\('\\[data-tab="' \+ tabName \+ '"\\]'\);\s*if \(navEl\) navEl\.classList\.add\('active'\);\s*\}/;
    
    html = html.replace(regex1, '};');
    
    // Also, inside DOMContentLoaded, it calls switchTab(this.dataset.tab) instead of window.switchTab. Let's fix that too.
    html = html.replace(/switchTab\(this\.dataset\.tab\);/g, 'window.switchTab(this.dataset.tab);');
    
    fs.writeFileSync(file, html);
}
console.log("Fixed script syntaxes");
