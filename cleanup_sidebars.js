const fs = require('fs');
const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html'
];

files.forEach(file => {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove old staff-portal toggleSidebar
    content = content.replace(/\/\* ─── Sidebar toggle \(mobile slide-in\) ─── \*\/\s*function toggleSidebar\(\) \{\s*document\.getElementById\('sidebar'\)\.classList\.toggle\('open'\);\s*document\.getElementById\('mobOverlay'\)\.classList\.toggle\('open'\);\s*\}/g, "");
    
    // Remove old admin-dashboard / school-portal logic inside DOMContentLoaded
    content = content.replace(/var hamburger\s*=\s*document\.getElementById\('hamburger'\);[\s\S]*?const icon_m = hamburger\.querySelector\('\.material-symbols-outlined'\); if\(icon_m\) icon_m\.textContent = 'menu';\s*\}\);/g, "");
    
    // Any remaining document.getElementById('sidebar')?.classList.remove('open');
    content = content.replace(/document\.getElementById\('sidebar'\)\?\.classList\.remove\('open'\);/g, "");
    content = content.replace(/document\.getElementById\('overlay'\)\?\.classList\.remove\('show'\);/g, "");

    fs.writeFileSync(file, content);
});
console.log("Cleaned old sidebars.");
