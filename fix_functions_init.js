const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const targetInit = `const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
await auth.authStateReady();
const db   = getFirestore(app);`;

const replacementInit = `const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
await auth.authStateReady();
const db   = getFirestore(app);
window.auth = auth; window.db = db;
window.functions = getFunctions(app);
window.httpsCallable = httpsCallable;`;

html = html.replace(targetInit, replacementInit);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Added window.functions");
