const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp({
  projectId: 'jaystarbliss-studios'
});

const db = getFirestore();

async function runAudit() {
  const studentsSnapshot = await db.collection('students').get();
  const individualStudentsSnapshot = await db.collection('individualStudents').get();

  console.log(`Total records in /students: ${studentsSnapshot.size}`);
  console.log(`Total records in /individualStudents: ${individualStudentsSnapshot.size}`);

  const studentsFields = new Set();
  studentsSnapshot.forEach(doc => {
    Object.keys(doc.data()).forEach(key => studentsFields.add(key));
  });

  const individualStudentsFields = new Set();
  individualStudentsSnapshot.forEach(doc => {
    Object.keys(doc.data()).forEach(key => individualStudentsFields.add(key));
  });

  console.log('Fields in /students:', Array.from(studentsFields));
  console.log('Fields in /individualStudents:', Array.from(individualStudentsFields));
}

runAudit().catch(console.error);
