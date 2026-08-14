const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

// 1. Store studentData in a variable so loadPersonalResources can use it.
const searchStr = `                if (!snap.empty) {
                    const d    = snap.docs[0];
                    const data = d.data();
                    // Repair the full session so subsequent loads are fast
                    localStorage.setItem('studentDocId',    d.id);
                    localStorage.setItem('userId',          user.uid);
                    localStorage.setItem('userRole',        'student');
                    localStorage.setItem('userName',        data.fullName || data.username || 'Student');`;

const replaceStr = `                if (!snap.empty) {
                    const d    = snap.docs[0];
                    const data = d.data();
                    window._jdh_studentData = data; // Store it globally for access
                    // Repair the full session so subsequent loads are fast
                    localStorage.setItem('studentDocId',    d.id);
                    localStorage.setItem('userId',          user.uid);
                    localStorage.setItem('userRole',        'student');
                    localStorage.setItem('userName',        data.fullName || data.username || 'Student');`;

html = html.replace(searchStr, replaceStr);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
console.log("Fixed student data");
