const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Ensure no ReferenceError and no silent fails
html = html.replace(/window\.switchTab = function\(name\) \{/, `window.switchTab = function(name) {
    console.log("switchTab called with:", name);
    try {`);
    
html = html.replace(/if\(pane\) pane\.classList\.add\('active'\);\s*\};/, `if(pane) pane.classList.add('active');
    } catch(e) { console.error("switchTab error:", e); }
};`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Patched switchTab with logs");
