const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const newRules = `
    // ════════════════════════════════════════════════════
    // QUIZZES & GAMIFICATION (PHASE C)
    // ════════════════════════════════════════════════════
    match /quizzes/{quizId} {
      allow read: if isAuthenticated();
      allow write: if isAdminOrStaff();
    }
    match /students/{studentId}/completedQuizzes/{quizId} {
      allow read, write: if isAuthenticated() && request.auth.uid == studentId;
    }
`;

if(!code.includes('QUIZZES & GAMIFICATION')) {
    code = code.replace(/\/\/ ════════════════════════════════════════════════════\s*\/\/ DEFAULT DENY/, newRules + '\n$&');
    fs.writeFileSync('firestore.rules', code);
    console.log("Patched firestore.rules for Phase C");
}
