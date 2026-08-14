const fs = require('fs');

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const configObj = JSON.parse(configStr);

const newConfigStr = `const firebaseConfig = {
  apiKey: "${configObj.apiKey}",
  authDomain: "${configObj.authDomain}",
  projectId: "${configObj.projectId}",
  storageBucket: "${configObj.storageBucket}",
  messagingSenderId: "${configObj.messagingSenderId}",
  appId: "${configObj.appId}"
};`;

let content = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', 'utf8');
content = content.replace(/const firebaseConfig = \{ \/\* NEED TO PATCH LATER \*\/ \};/, newConfigStr);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', content, 'utf8');

// Also update school portal to restrict students by schoolId
let schoolContent = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', 'utf8');
// Assuming the school portal lists students via a query
schoolContent = schoolContent.replace(
  /query\(collection\(db, 'students'\)\)/g, 
  "query(collection(db, 'students'), where('schoolId', '==', localStorage.getItem('schoolId') || 'unknown'))"
);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', schoolContent, 'utf8');
console.log('Firebase config applied to tutor-portal');
