const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const regexLimit = /let snap = await getDocs\(query\(collection\(db, 'students'\), where\('email', '==', emailNorm\)\)\);/;
const replacementLimit = `console.log("Querying for email:", emailNorm);
    let snap = await getDocs(query(collection(db, 'students'), where('email', '==', emailNorm)));
    console.log("Email query empty?", snap.empty);
    if (snap.empty) {
      console.log("Trying exact username:", email.trim());
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', email.trim())));
      if (snap.empty) {
        console.log("Trying lowercase username:", emailNorm);
        snap = await getDocs(query(collection(db, 'students'), where('username', '==', emailNorm)));
      }
    }`;

code = code.replace(regexLimit, replacementLimit);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
console.log("Added debug logs to login query");
