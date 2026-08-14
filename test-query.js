import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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
  const q = query(collection(db, 'services'), where('status', '==', 'PUBLISHED'), where('isFeatured', '==', true));
  try {
    const snapshot = await getDocs(q);
    console.log("Featured Services matching query: ", snapshot.docs.length);
    process.exit(0);
  } catch (e) {
    console.error("Query failed:", e);
    process.exit(1);
  }
}
run();
