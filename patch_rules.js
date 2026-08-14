const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const newRules = `
    // ════════════════════════════════════════════════════
    // CYCLES & SESSIONS (PHASE B)
    // ════════════════════════════════════════════════════
    match /cycles/{cycleId} {
      allow read: if isAdminOrStaff() || 
                  (isAuthenticated() && getUserRole() == 'tutor' && resource.data.tutorId == request.auth.uid) ||
                  (isAuthenticated() && request.auth.uid == resource.data.studentId) ||
                  (isAuthenticated() && isParent() && get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.parentId == request.auth.uid);
      allow write: if isAdminOrStaff();
    }
    match /sessions/{sessionId} {
      allow read: if isAdminOrStaff() || 
                  (isAuthenticated() && getUserRole() == 'tutor' && resource.data.tutorId == request.auth.uid) ||
                  (isAuthenticated() && request.auth.uid == resource.data.studentId) ||
                  (isAuthenticated() && isParent() && get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.parentId == request.auth.uid);
      allow create, delete: if isAdminOrStaff();
      // Tutors can update attendance
      allow update: if isAdminOrStaff() || (isAuthenticated() && getUserRole() == 'tutor' && resource.data.tutorId == request.auth.uid);
    }
`;

if(!code.includes('CYCLES & SESSIONS')) {
    code = code.replace(/\/\/ ════════════════════════════════════════════════════\s*\/\/ DEFAULT DENY/, newRules + '\n$&');
    fs.writeFileSync('firestore.rules', code);
    console.log("Patched firestore.rules for Phase B");
}
