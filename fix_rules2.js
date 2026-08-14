const fs = require('fs');
let rules = fs.readFileSync('firestore.rules.backup', 'utf8');

rules = rules.replace(
  /match \/students\/\{studentId\} \{\s*\/\/.*?\s*allow read: if isAdminOrStaff\(\)[\s\S]*?parentId == request\.auth\.uid\);/,
  `match /students/{studentId} {\n      allow read: if true;`
);

fs.writeFileSync('firestore.rules', rules);
