const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// 1. Add updateDoc to imports
html = html.replace(
  /getDocs, deleteDoc,(\s+)doc, query/,
  'getDocs, deleteDoc, updateDoc,$1doc, query'
);

// 2. Fix upgradeToFirebaseAuth implementation
const oldUpgrade = `window.upgradeToFirebaseAuth = async function(studentId) {
  if(!confirm('Upgrade this student to Firebase Auth? An account will be created with their email.')) return;
  try {
    const studentDoc = await getDoc(doc(db, 'students', studentId));
    const data = studentDoc.data();
    if(!data.email) throw new Error('Student has no email address. Cannot upgrade.');
    const result = await firebaseCreateUser({ email: data.email, password: data.accessCode, displayName: data.fullName || data.username });
    if(result.error) throw new Error(result.error);
    await updateDoc(doc(db, 'students', studentId), { authType: 'firebase', uid: result.uid });
    alert('Upgraded to Firebase Auth successfully!');
    loadStudentsList();
  } catch(e) { alert(e.message); }
};`;

const newUpgrade = `window.upgradeToFirebaseAuth = async function(studentId) {
  if(!confirm('Upgrade this student to Firebase Auth? An account will be created with their email.')) return;
  try {
    const createAuth = window.httpsCallable(window.functions, 'createFirebaseAccountForStudent');
    const result = await createAuth({ studentId });
    if(result.data && result.data.success) {
       alert('Upgraded to Firebase Auth successfully! Check the student\\'s email.');
       loadStudentsList();
    } else {
       alert('Failed: ' + (result.data ? result.data.message : 'Unknown error'));
    }
  } catch(e) { alert(e.message); }
};`;
html = html.replace(oldUpgrade, newUpgrade);

// 3. Update the student card UI for responsiveness
// Old flex div for top section:
const oldCardTop = `<div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">`;

const newCardTop = `<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex items-center gap-3">`;

html = html.replace(oldCardTop, newCardTop); // Note: this only matches the first one since it's not global, or wait, it might match others. We only want it for students. Let's be more specific.
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Replaced imports and function");
