const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

html = html.replace(
    "const pane = document.getElementById(name);",
    "const pane = document.getElementById('tab-' + name) || document.getElementById(name);"
);

// Populate user name and email
if (html.includes("localStorage.getItem('userName')") === false) {
    // Add logic to populate topNavNameDisplay and navRoleFallback
    html = html.replace(
        "const db   = getFirestore(app);",
        "const db   = getFirestore(app);\n  const parentName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'Parent';\n  const topNavNameDisplay = document.getElementById('topNavNameDisplay');\n  if (topNavNameDisplay) topNavNameDisplay.textContent = parentName;\n  const navRoleFallback = document.getElementById('navRoleFallback');\n  if (navRoleFallback) navRoleFallback.textContent = localStorage.getItem('userEmail') || 'Parent Account';\n  const initials = document.getElementById('topNavInitials');\n  if (initials) initials.textContent = parentName.charAt(0).toUpperCase();"
    );
}

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', html);
console.log("Fixed parent portal");
