const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/firestore.rules', 'utf8');

const target = `    function getSchoolAdminSchoolId() {
      return get(/databases/$(database)/documents/schoolAdmins/$(request.auth.uid)).data.schoolId;
    }`;

const replacement = `    function getSchoolAdminSchoolId() {
      return exists(/databases/$(database)/documents/schoolAdmins/$(request.auth.uid)) ? get(/databases/$(database)/documents/schoolAdmins/$(request.auth.uid)).data.schoolId : null;
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/firestore.rules', code);
console.log("Fixed rules");
