const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const target = `    let snap = await getDocs(
      query(
        collection(db, 'students'),
        where('email', '==', emailNorm)
      )
    );`;

// Wait, the original is:
//    const snap = await getDocs(
//      query(
//        collection(db, 'students'),
//        where('email', '==', emailNorm)
//      )
//    );

const regex = /const snap = await getDocs\(\s*query\(\s*collection\(db, 'students'\),\s*where\('email', '==', emailNorm\)\s*\)\s*\);/m;

const replacement = `    let snap = await getDocs(query(collection(db, 'students'), where('email', '==', emailNorm)));
    if (snap.empty) {
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', emailNorm)));
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
console.log("Fixed loginWithAccessCode to support username fallback");
