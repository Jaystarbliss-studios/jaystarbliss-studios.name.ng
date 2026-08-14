const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const oldScript = html.match(/<script type="module">[\s\S]*?import { getApps }[\s\S]*?<\/script>/)[0];

const newScript = oldScript.replace(
  "import { getApps } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';",
  "import { getApps } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';\nimport { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';"
).replace(
  "const db = getFirestore(app);",
  "const db = getFirestore(app);\nconst auth = getAuth(app);"
).replace(
  "var grid = document.getElementById('studentResourcesGrid');",
  "var grid = document.getElementById('studentResourcesGrid');\n  await auth.authStateReady();"
);

if (html.includes(oldScript) && oldScript !== newScript) {
    html = html.replace(oldScript, newScript);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
    console.log("Fixed studentResources to wait for auth state");
} else {
    console.log("Could not find or replace old script");
}
