const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const snap = await db.collection('students').get();
  snap.forEach(doc => {
    const data = doc.data();
    console.log(doc.id, "=>", "Username:", data.username, "Email:", data.email, "AccessCode:", data.accessCode);
  });
}
run();
