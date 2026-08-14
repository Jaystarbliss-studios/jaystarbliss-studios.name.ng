import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

async function seed() {
  await addDoc(collection(db, 'programs'), {
    title: "Summer Code Camp 2026",
    slug: "summer-code-camp",
    categoryId: "Coding for Kids",
    shortDescription: "A fun, interactive 4-week coding bootcamp for kids and teens.",
    longDescription: "Learn to build games, websites, and apps this summer!",
    status: "PUBLISHED",
    isFeatured: true,
    pricing: "₦40,000",
    deliveryFormat: "PHYSICAL",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  await addDoc(collection(db, 'services'), {
    title: "Summer Experience",
    slug: "summer-experience",
    shortDescription: "Exciting fun learning experience for everyone.",
    content: "Full service digital experience.",
    status: "PUBLISHED",
    isFeatured: true,
    iconName: "Monitor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  console.log("Seeded database!");
  process.exit(0);
}
seed();
