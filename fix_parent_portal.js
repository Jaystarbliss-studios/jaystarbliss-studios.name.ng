const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');
if(html.includes('SUBJECTS.map(')) {
    console.log("SUBJECTS script is present");
}
