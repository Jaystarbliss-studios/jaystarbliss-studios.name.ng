const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', 'utf8');

const target2 = `localStorage.setItem('userEmail', email);`;
const replacement2 = `localStorage.setItem('userEmail', studentData.email || internalAuthEmail);`;

html = html.replace(target2, replacement2);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', html);
console.log("Fixed student login localstorage");
