const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Replace all instances of 'if(typeof auth !== "undefined") await auth.authStateReady(); if(typeof auth !== "undefined") await auth.authStateReady();'
// with a single one.

while (html.includes('if(typeof auth !== "undefined") await auth.authStateReady(); if(typeof auth !== "undefined") await auth.authStateReady();')) {
    html = html.replace('if(typeof auth !== "undefined") await auth.authStateReady(); if(typeof auth !== "undefined") await auth.authStateReady();', 'if(typeof auth !== "undefined") await auth.authStateReady();');
}

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Cleaned up duplicates");
