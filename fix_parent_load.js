const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');
html = html.replace(/loadConversations\(\);/g, '');
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', html);
console.log("Fixed loadConversations");
