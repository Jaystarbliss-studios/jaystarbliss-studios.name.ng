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
    
    // Add id to role if missing
    html = html.replace(/<p class="font-label-md text-label-md text-on-surface-variant">([^<]+)<\/p>/, '<p id="navRoleFallback" class="font-label-md text-label-md text-on-surface-variant">$1</p>');
    
    // add logic to set name and role
    const scriptLogic = `
        setTimeout(() => {
            const savedName = localStorage.getItem('userName');
            const savedRole = localStorage.getItem('userRole');
            const nameSrc = document.getElementById('navNameFallback');
            const roleSrc = document.getElementById('navRoleFallback');
            if(nameSrc && savedName) {
                nameSrc.innerText = savedName;
                const initials = savedName.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
                const navInitials = document.getElementById('topNavInitials');
                if(navInitials) navInitials.innerText = initials;
            }
            if(roleSrc && savedRole) {
                const roleFormatted = savedRole.charAt(0).toUpperCase() + savedRole.slice(1);
                roleSrc.innerText = roleFormatted;
            }
        }, 100);
    `;
    
    if(!html.includes('localStorage.getItem(\'userName\')')) {
        html = html.replace(/setTimeout\(\(\) => \{[^]*?const nameSrc = document.getElementById\('navNameFallback'\);[^]*?\}\, 100\);|setTimeout\(\(\) => \{[^]*?const nameSrc = document.getElementById\('navNameFallback'\);[^]*?\}\);/g, "");
        html = html.replace(/<\/body>/, `<script>${scriptLogic}</script>\n</body>`);
    }
    
    fs.writeFileSync(file, html);
}
console.log("Updated usernames across dashboards");
