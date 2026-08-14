import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    let snap = await getDocs(query(collection(db, 'students'), where('username', '==', 'jaystarbliss')));
    console.log("Found", snap.size, "students");
    snap.forEach(doc => {
      const data = doc.data();
      console.log("U:", data.username, "C:", data.accessCode, "H:", data.accessCodeHash);
    });
  } catch(e) {
    console.error(e);
  }
}
run();
