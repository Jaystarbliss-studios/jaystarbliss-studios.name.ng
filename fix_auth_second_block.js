const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(
    "const db  = getFirestore(app);",
    "const db  = getFirestore(app);\n  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');\n  const auth = getAuth(app);"
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Added auth to second block");
