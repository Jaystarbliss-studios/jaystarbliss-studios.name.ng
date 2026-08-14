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

    // Add closeSidebar if missing or if it doesn't close correctly
    const closeScript = `
  window.closeSidebar = function() {
    const sb = document.getElementById('appSidebar');
    const ov = document.getElementById('mobileOverlay');
    if(sb) sb.classList.add('-translate-x-full');
    if(ov) ov.classList.add('hidden');
  };
`;
    if(!content.includes('window.closeSidebar = function()')) {
        content = content.replace(/function switchTab/g, closeScript + '\n  function switchTab');
    }

    fs.writeFileSync(file, content);
});
console.log("Forced closeSidebar.");
