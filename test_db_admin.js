const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { readFileSync } = require('fs');

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
initializeApp({
  projectId: config.projectId
});

const db = getFirestore();

async function run() {
  const snap = await db.collection('students').get();
  snap.forEach(doc => {
    const data = doc.data();
    console.log("UNAME:", data.username, "CODE:", data.accessCode, "EMAIL:", data.email);
  });
}
run();
