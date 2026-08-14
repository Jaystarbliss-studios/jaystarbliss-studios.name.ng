import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-jaystarblissdyna-085e16ac-52ee-43ae-9c0c-52f6db7f8f7c");

async function run() {
  const snapshot = await getDocs(collection(db, "services"));
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
  
  const pSnapshot = await getDocs(collection(db, "programs"));
  pSnapshot.forEach(doc => {
    console.log("Program:", doc.id, "=>", doc.data());
  });
  process.exit(0);
}
run();
