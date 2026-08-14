const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

// allow update: if isAdminOrStaff() || (isAuthenticated() && request.auth.uid == studentId);
code = code.replace(/allow update: if isAdminOrStaff\(\);/, "allow update: if isAdminOrStaff() || (isAuthenticated() && request.auth.uid == resource.data.uid);");

fs.writeFileSync('firestore.rules', code);
console.log("Patched firestore.rules to allow students to update their gamification");
