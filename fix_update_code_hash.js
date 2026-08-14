const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const target = `try { await updateDoc(doc(db, 'students', id), { accessCode: code }); alert('Code updated!'); loadStudentsList(); } catch(e) { alert(e.message); }`;
const replacement = `try { await updateDoc(doc(db, 'students', id), { accessCode: code, accessCodeHash: null }); alert('Code updated!'); loadStudentsList(); } catch(e) { alert(e.message); }`;

html = html.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed updateStudentCode to clear hash");
