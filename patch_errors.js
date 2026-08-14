const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(/catch\(e\) \{ (grid|container|select)\.innerHTML = (emptyMsg|'<option value="">Error loading<\/option>|`<div class="req-empty">Error loading: \$\{err\.message\}<\/div>`)\([^)]*\); \}/g, (match) => {
    return match.replace(/\{/, '{ console.error(e);');
});

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Patched admin errors");
