const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const target = `        console.log("Querying for email:", emailNorm);
    let snap = await getDocs(query(collection(db, 'students'), where('email', '==', emailNorm)));
    console.log("Email query empty?", snap.empty);
    if (snap.empty) {
      console.log("Trying exact username:", email.trim());
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', email.trim())));
      if (snap.empty) {
        console.log("Trying lowercase username:", emailNorm);
        snap = await getDocs(query(collection(db, 'students'), where('username', '==', emailNorm)));
      }
    }
    if (snap.empty) {
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', emailNorm)));
    }`;

const replacement = `    console.log("Querying for email:", emailNorm);
    let snap = await getDocs(query(collection(db, 'students'), where('email', '==', emailNorm)));
    if (snap.empty) {
      console.log("Trying exact username:", email.trim());
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', email.trim())));
    }
    if (snap.empty) {
      console.log("Trying lowercase username:", emailNorm);
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', emailNorm)));
    }
    if (snap.empty) {
      console.log("Trying uppercase username:", email.trim().toUpperCase());
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', email.trim().toUpperCase())));
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
console.log("Fixed query block");
