const fs = require('fs');
let rules = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/firestore.rules', 'utf8');

const target = `      allow delete: if isAdmin();`;
const replacement = `      allow delete: if isAdmin() || (isSchoolAdmin() && resource.data.schoolId == getSchoolAdminSchoolId());`;

if (rules.includes(target)) {
    rules = rules.replace(target, replacement);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/firestore.rules', rules);
    console.log("Updated delete rule for students");
} else {
    console.log("Could not find target");
}
