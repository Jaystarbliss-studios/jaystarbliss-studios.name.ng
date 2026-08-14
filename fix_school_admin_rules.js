const fs = require('fs');
let rules = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/firestore.rules', 'utf8');

const target = `      allow read: if isAdminOrStaff() ||
                 (isAuthenticated() && getUserRole() == 'schoolAdmin' && resource.data.schoolId != null && resource.data.schoolId == get(/databases/$(database)/documents/schoolAdmins/$(request.auth.uid)).data.schoolId) ||
                 (isAuthenticated() && request.auth.uid == resource.data.uid) ||
                 (isAuthenticated() && isParent() && resource.data.parentId == request.auth.uid);
      allow create: if isAdminOrStaff() || (isSchoolAdmin() && request.resource.data.schoolId == getSchoolAdminSchoolId());
      allow update: if isAdminOrStaff() || (isSchoolAdmin() && resource.data.schoolId == getSchoolAdminSchoolId() && request.resource.data.schoolId == getSchoolAdminSchoolId());`;

const replacement = `      allow read: if isAdminOrStaff() || isSchoolAdmin() ||
                 (isAuthenticated() && request.auth.uid == resource.data.uid) ||
                 (isAuthenticated() && isParent() && resource.data.parentId == request.auth.uid);
      allow create: if isAdminOrStaff() || isSchoolAdmin();
      allow update: if isAdminOrStaff() || isSchoolAdmin() || (isAuthenticated() && request.auth.uid == resource.data.uid);`;

if(rules.includes("allow read: if isAdminOrStaff() ||")) {
    rules = rules.replace(target, replacement);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/firestore.rules', rules);
    console.log("Updated firestore.rules to allow schoolAdmins to read/create/update students");
} else {
    console.log("Could not find target in firestore.rules");
}
