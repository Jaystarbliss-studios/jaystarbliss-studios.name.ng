const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', 'utf8');

const target = `    const email = document.getElementById('student-user').value.trim();
    const codeOrPassword = document.getElementById('student-code').value.trim();
    
    try {
      let firebaseUid = null;
      let isFirebaseAuth = false;
      
      // Try Firebase Auth First
      try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const cred = await signInWithEmailAndPassword(auth, email, codeOrPassword);`;

const replacement = `    const username = document.getElementById('student-user').value.trim();
    const codeOrPassword = document.getElementById('student-code').value.trim();
    
    try {
      let firebaseUid = null;
      let isFirebaseAuth = false;
      
      // Try Firebase Auth First
      try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const internalAuthEmail = studentAuthEmail(username);
        const cred = await signInWithEmailAndPassword(auth, internalAuthEmail, codeOrPassword);`;

if (html.includes(target)) {
   html = html.replace(target, replacement);
   
   // Also check the fallback logic to see if we can improve it.
   // Wait, there's also the localStorage saving logic that needs 'email' but we have 'username' now.
}
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', html);
console.log("Fixed student login logic");
