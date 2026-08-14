const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(/async function load[A-Za-z0-9_]*\(\)\s*\{/g, (match) => {
    if (!match.includes('auth.authStateReady')) {
        return match + ' if(typeof auth !== "undefined") await auth.authStateReady();';
    }
    return match;
});

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed ALL load functions");
