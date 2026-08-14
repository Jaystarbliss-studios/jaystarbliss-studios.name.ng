const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', 'utf8');

const target = `    // Check if the user is a school admin
    try {
        const adminDoc = await getDoc(doc(db, 'users', user.uid));
        if (adminDoc.exists() && adminDoc.data().role === 'schoolAdmin') {
            const data = adminDoc.data();
            currentSchoolId = data.schoolId;`;

const replacement = `    // Check if the user is a school admin
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const adminDoc = await getDoc(doc(db, 'schoolAdmins', user.uid));
        
        if (userDoc.exists() && userDoc.data().role === 'schoolAdmin' && adminDoc.exists()) {
            const data = adminDoc.data();
            currentSchoolId = data.schoolId;`;

html = html.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', html);
console.log("Fixed school-portal admin logic");
