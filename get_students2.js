import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snap = await getDocs(collection(db, 'students'));
  console.log("Found", snap.size, "students");
  snap.forEach(doc => {
    const data = doc.data();
    console.log("Student:", data.fullName, "| Username:", data.username, "| Email:", data.email, "| AccessCode/Password:", data.accessCode);
  });
}
run();
