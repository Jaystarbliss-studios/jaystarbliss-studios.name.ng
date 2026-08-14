const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', 'utf8');

// We want to pass the inputted email directly to signInWithEmailAndPassword, 
// and to loginWithAccessCode.
html = html.replace(/const username = document.getElementById\('student-user'\).value.trim\(\);/, `const email = document.getElementById('student-user').value.trim();`);

// Remove internalAuthEmail assignment and use email
html = html.replace(/internalAuthEmail = studentAuthEmail\(username\);/, '');
html = html.replace(/const cred = await signInWithEmailAndPassword\(auth, internalAuthEmail, codeOrPassword\);/, `const cred = await signInWithEmailAndPassword(auth, email, codeOrPassword);`);
html = html.replace(/localStorage\.setItem\('userEmail', studentData\.email \|\| internalAuthEmail\);/, `localStorage.setItem('userEmail', studentData.email || email);`);

// And the fallback
html = html.replace(/const studentData = await loginWithAccessCode\(username, codeOrPassword\);/, `const studentData = await loginWithAccessCode(email, codeOrPassword);`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', html);
console.log("Reverted to email for student login");
