const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', 'utf8');

const target = `      if (isFirebaseAuth) {
        // Find student doc
        const snap = await getDocs(query(collection(db, 'students'), where('uid', '==', firebaseUid)));
        if (snap.empty) {
          throw new Error('Student record not found for this account.');
        }
        const studentData = snap.docs[0].data();
        
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userId', firebaseUid);
        localStorage.setItem('studentDocId', snap.docs[0].id);
        localStorage.setItem('userEmail', studentData.email || email);
        localStorage.setItem('userName', studentData.name || studentData.fullName || '');
        localStorage.setItem('studentType', studentData.studentType || 'private');
        
        if (studentData.studentType === 'school') {
          window.location.href = REDIRECTS.individualStudent; // Actually student-portal
        } else {
          window.location.href = '../dashboard/private-student-portal.html';
        }
        return;
      }`;

const replacement = `      if (isFirebaseAuth) {
        // First check 'users' collection (admins, tutors, schoolAdmins, staff)
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const userDoc = await getDoc(doc(db, 'users', firebaseUid));
        if (userDoc.exists()) {
           const role = userDoc.data().role;
           localStorage.setItem('userRole', role);
           localStorage.setItem('userId', firebaseUid);
           localStorage.setItem('userEmail', email);
           
           if (role === 'admin') {
              window.location.href = '../dashboard/admin-dashboard.html';
           } else if (role === 'tutor') {
              window.location.href = '../dashboard/tutor-portal.html';
           } else if (role === 'schoolAdmin') {
              window.location.href = '../dashboard/school-portal.html';
           } else if (role === 'staff') {
              window.location.href = '../dashboard/staff-portal.html';
           } else {
              window.location.href = '../dashboard/student-portal.html';
           }
           return;
        }

        // If not in users, check 'students' doc
        const snap = await getDocs(query(collection(db, 'students'), where('uid', '==', firebaseUid)));
        if (!snap.empty) {
            const studentData = snap.docs[0].data();
            
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('userId', firebaseUid);
            localStorage.setItem('studentDocId', snap.docs[0].id);
            localStorage.setItem('userEmail', studentData.email || email);
            localStorage.setItem('userName', studentData.name || studentData.fullName || '');
            localStorage.setItem('studentType', studentData.studentType || 'private');
            
            if (studentData.studentType === 'school') {
              window.location.href = REDIRECTS.individualStudent; // student-portal.html
            } else {
              window.location.href = '../dashboard/private-student-portal.html';
            }
            return;
        }
        
        throw new Error('Account found, but no role assigned. Contact admin.');
      }`;

code = code.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', code);
console.log("Updated login logic to support users collection!");
