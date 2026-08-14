const fs = require('fs');
const file = 'src/pages/Portal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') msg = 'No account found with that email.';",
  "if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') msg = 'No account found. Please click Sign up (Register) below to create one.';"
);

fs.writeFileSync(file, content);
console.log("Updated error message.");
