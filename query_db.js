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
const db = getFirestore(app);

async function run() {
  const r = await getDocs(collection(db, 'resources'));
  console.log("Resources:", r.size);
  const sr = await getDocs(collection(db, 'schoolResources'));
  console.log("School Resources:", sr.size);
  const l = await getDocs(collection(db, 'links'));
  console.log("Links:", l.size);
}
run().catch(console.error);
