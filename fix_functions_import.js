const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const targetImport = `import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc,
  doc, query, orderBy, where, serverTimestamp, setDoc, getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';`;

const replacementImport = `import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc,
  doc, query, orderBy, where, serverTimestamp, setDoc, getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';`;

html = html.replace(targetImport, replacementImport);

const targetInit = `const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
window.auth = auth; window.db = db;`;

const replacementInit = `const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const functions = getFunctions(app, 'europe-west3'); // we need to check the region, wait, if default region, just getFunctions(app)
window.auth = auth; window.db = db;
window.functions = getFunctions(app);
window.httpsCallable = httpsCallable;`;

html = html.replace(targetInit, replacementInit);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Added functions import");
