/**
 * ════════════════════════════════════════════════════════════
 *  JDH FIREBASE MODULES  —  jdh-firebase-modules.js
 *  Jaystarbliss Dynamic Hub · Shared Integration Layer
 * ════════════════════════════════════════════════════════════
 *
 *  HOW TO USE:
 *  Import this file as a <script type="module"> AFTER your
 *  Firebase SDK imports, or import individual functions from it.
 *
 *  All pages already using Firebase SDK 10.7.1 can import:
 *    import { generateAccessCode, routeByRole, ... }
 *      from '../../assets/js/jdh-firebase-modules.js';
 *
 *  Place this file at:  assets/js/jdh-firebase-modules.js
 * ════════════════════════════════════════════════════════════
 */

// ── Firebase SDK (re-export so pages can share one config) ──
import { initializeApp, getApps }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore,
  collection, addDoc, setDoc, getDoc, getDocs, deleteDoc,
  doc, query, where, orderBy, serverTimestamp,
  onSnapshot, updateDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ════════════════════════════════════════════════════
// FIREBASE CONFIG  (single source of truth)
// ════════════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

// Prevent duplicate app initialisation across pages
const app  = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };

// ════════════════════════════════════════════════════
// ACCESS CODE GENERATOR
// Generates a random 6–8 character alphanumeric code.
// ════════════════════════════════════════════════════
export function generateAccessCode(length = 7) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O/1/I
  let code = '';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  arr.forEach(b => { code += chars[b % chars.length]; });
  return code;
}

// ════════════════════════════════════════════════════
// ROLE-BASED ROUTING
// Call after onAuthStateChanged to redirect user to
// their correct portal page.
// ════════════════════════════════════════════════════

/** Map of role → portal URL (relative to /pages/) */
const ROLE_ROUTES = {
  admin:             '/pages/admin/admin.html',
  staff:             '/pages/staff/staff-portal.html',
  parent:            '/pages/parent/parent-dashboard.html',
  student:           '/pages/student/student-portal.html',
  individualStudent: '/pages/student/private-student-portal.html'
};

/**
 * routeByRole(uid)
 * Reads the user's role from Firestore `users` collection and
 * redirects accordingly.  Falls back to login on unknown role.
 */
export async function routeByRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      // Not in `users` — check `individualStudents` by uid field
      const snap = await getDocs(
        query(collection(db, 'individualStudents'), where('uid', '==', uid))
      );
      if (!snap.empty) {
        const data = snap.docs[0].data();
        _saveSession(snap.docs[0].id, data, 'individualStudent');
        window.location.href = ROLE_ROUTES.individualStudent;
        return;
      }
      window.location.href = '/pages/auth/login.html';
      return;
    }
    const data = userDoc.data();
    const role = data.role;
    _saveSession(uid, data, role);
    window.location.href = ROLE_ROUTES[role] || '/pages/auth/login.html';
  } catch (e) {
    console.error('[JDH] routeByRole error:', e);
    window.location.href = '/pages/auth/login.html';
  }
}

function _saveSession(uid, data, role) {
  sessionStorage.setItem('userId',    uid);
  sessionStorage.setItem('userRole',  role);
  sessionStorage.setItem('userEmail', data.email || '');
  sessionStorage.setItem('userName',  data.name  || data.fullName || '');
  if (data.parentId)  sessionStorage.setItem('parentId',  data.parentId);
  if (data.studentId) sessionStorage.setItem('studentId', data.studentId);
}

// ════════════════════════════════════════════════════
// AUTH GUARD
// Use at the top of every protected page.
// guardPage('admin')  — redirects if not admin
// guardPage(['admin','staff'])  — allows either role
// ════════════════════════════════════════════════════
export function guardPage(allowedRoles) {
  const roles  = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const current = sessionStorage.getItem('userRole');
  if (!current || !roles.includes(current)) {
    sessionStorage.clear();
    window.location.href = '/pages/auth/login.html';
    return false;
  }
  // Also verify via Firebase Auth state (belt-and-suspenders)
  onAuthStateChanged(auth, user => {
    if (!user) {
      sessionStorage.clear();
      window.location.href = '/pages/auth/login.html';
    }
  });
  return true;
}

// ════════════════════════════════════════════════════
// STUDENT LOGIN VIA ACCESS CODE
// Verifies email + accessCode against `individualStudents`.
// Returns student doc data on success, null on failure.
// ════════════════════════════════════════════════════
export async function loginWithAccessCode(email, accessCode) {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'individualStudents'),
        where('email', '==', email.trim().toLowerCase()),
        where('accessCode', '==', accessCode.trim())
      )
    );
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  } catch (e) {
    console.error('[JDH] loginWithAccessCode error:', e);
    return null;
  }
}

// ════════════════════════════════════════════════════
// APPROVE STUDENT REQUEST
// Admin action: reads a `student_requests` doc, creates
// the student account, and updates the request status.
// ════════════════════════════════════════════════════
export async function approveStudentRequest(requestId) {
  const reqRef  = doc(db, 'student_requests', requestId);
  const reqSnap = await getDoc(reqRef);
  if (!reqSnap.exists()) throw new Error('Request not found');

  const data       = reqSnap.data();
  const accessCode = generateAccessCode();

  // 1. Save to `students` collection (role-based multi-portal students)
  await setDoc(doc(db, 'students', requestId), {
    uid:        null,          // populated on first Firebase Auth login
    name:       data.name,
    email:      data.email,
    accessCode,
    parentId:   data.parentId  || null,
    subjects:   data.subjects  || [],
    role:       'student',
    createdAt:  serverTimestamp()
  });

  // 2. Also save to `individualStudents` for private portal compatibility
  const indivRef = await addDoc(collection(db, 'individualStudents'), {
    fullName:    data.name,
    username:    data.email.split('@')[0],
    email:       data.email.toLowerCase(),
    accessCode,
    parentId:    data.parentId || null,
    subjects:    data.subjects || [],
    registeredAt: serverTimestamp()
  });

  // 3. Mark request approved
  await updateDoc(reqRef, {
    status:     'approved',
    accessCode,
    studentId:  indivRef.id,
    approvedAt: serverTimestamp()
  });

  return { accessCode, studentId: indivRef.id };
}

// ════════════════════════════════════════════════════
// REJECT STUDENT REQUEST
// ════════════════════════════════════════════════════
export async function rejectStudentRequest(requestId, reason = '') {
  await updateDoc(doc(db, 'student_requests', requestId), {
    status:     'rejected',
    reason,
    rejectedAt: serverTimestamp()
  });
}

// ════════════════════════════════════════════════════
// APPROVE TUTOR APPLICATION
// Creates entry in `tutors` collection.
// ════════════════════════════════════════════════════
export async function approveTutorApplication(applicationId) {
  const appRef  = doc(db, 'tutor_applications', applicationId);
  const appSnap = await getDoc(appRef);
  if (!appSnap.exists()) throw new Error('Application not found');

  const data = appSnap.data();

  await setDoc(doc(db, 'tutors', applicationId), {
    name:      data.name,
    email:     data.email,
    subjects:  data.subjects || [],
    phone:     data.phone    || '',
    role:      'tutor',
    createdAt: serverTimestamp()
  });

  await updateDoc(appRef, {
    status:     'approved',
    approvedAt: serverTimestamp()
  });
}

// ════════════════════════════════════════════════════
// APPROVE ENROLLMENT REQUEST
// Links student to parent, assigns subjects + schedule.
// Creates student account if not already present.
// ════════════════════════════════════════════════════
export async function approveEnrollmentRequest(enrollmentId) {
  const enrRef  = doc(db, 'enrollment_requests', enrollmentId);
  const enrSnap = await getDoc(enrRef);
  if (!enrSnap.exists()) throw new Error('Enrollment request not found');

  const data = enrSnap.data();

  // Check if student already exists
  let studentId = data.studentId || null;

  if (!studentId) {
    const accessCode = generateAccessCode();
    const indivRef = await addDoc(collection(db, 'individualStudents'), {
      fullName:    data.studentName,
      username:    (data.studentEmail || data.studentName).split('@')[0].replace(/\s+/g, '').toLowerCase(),
      email:       (data.studentEmail || '').toLowerCase(),
      accessCode,
      parentId:    data.parentId,
      subjects:    data.subjects  || [],
      schedule:    data.schedule  || '',
      plan:        data.plan      || '',
      registeredAt: serverTimestamp()
    });
    studentId = indivRef.id;

    // Mark payment as first record
    await addDoc(collection(db, 'payments'), {
      parentId:     data.parentId,
      studentId,
      enrollmentId,
      amount:       data.amount || 0,
      plan:         data.plan   || '',
      status:       'pending',
      createdAt:    serverTimestamp()
    });
  } else {
    // Link existing student to parent
    await updateDoc(doc(db, 'individualStudents', studentId), {
      parentId: data.parentId,
      subjects: data.subjects || [],
      schedule: data.schedule || '',
      plan:     data.plan     || ''
    });
  }

  // Update parent's children array
  const parentRef  = doc(db, 'parents', data.parentId);
  const parentSnap = await getDoc(parentRef);
  if (parentSnap.exists()) {
    const children = parentSnap.data().children || [];
    if (!children.includes(studentId)) {
      await updateDoc(parentRef, { children: [...children, studentId] });
    }
  }

  // Mark enrollment approved
  await updateDoc(enrRef, {
    status:     'approved',
    studentId,
    approvedAt: serverTimestamp()
  });

  return { studentId };
}

// ════════════════════════════════════════════════════
// REAL-TIME LISTENER HELPERS
// Returns unsubscribe functions — call them on page unload.
// ════════════════════════════════════════════════════

/**
 * listenToCollection(collectionName, callback, queryConstraints?)
 * Fires callback(docs[]) whenever the collection changes.
 */
export function listenToCollection(collectionName, callback, constraints = []) {
  const q = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : query(collection(db, collectionName), orderBy('createdAt', 'desc'));

  return onSnapshot(q, snap => {
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(docs);
  }, err => console.error(`[JDH] listener error on ${collectionName}:`, err));
}

/**
 * listenToPendingRequests(callback)
 * Convenience: listens to student_requests with status == 'pending'
 */
export function listenToPendingRequests(callback) {
  return listenToCollection(
    'student_requests',
    callback,
    [where('status', '==', 'pending'), orderBy('createdAt', 'desc')]
  );
}

/**
 * listenToPendingEnrollments(callback)
 */
export function listenToPendingEnrollments(callback) {
  return listenToCollection(
    'enrollment_requests',
    callback,
    [where('status', '==', 'pending'), orderBy('createdAt', 'desc')]
  );
}

/**
 * listenToPendingApplications(callback)
 */
export function listenToPendingApplications(callback) {
  return listenToCollection(
    'tutor_applications',
    callback,
    [where('status', '==', 'pending'), orderBy('createdAt', 'desc')]
  );
}

// ════════════════════════════════════════════════════
// PAYMENT HELPERS
// ════════════════════════════════════════════════════
export async function updatePaymentStatus(paymentId, status) {
  await updateDoc(doc(db, 'payments', paymentId), {
    status,
    updatedAt: serverTimestamp()
  });
}

export async function addPaymentRecord(data) {
  return await addDoc(collection(db, 'payments'), {
    ...data,
    createdAt: serverTimestamp()
  });
}

// ════════════════════════════════════════════════════
// PARENT HELPERS
// ════════════════════════════════════════════════════

/**
 * getChildrenForParent(parentId)
 * Returns array of student documents linked to a parent.
 */
export async function getChildrenForParent(parentId) {
  const snap = await getDocs(
    query(collection(db, 'individualStudents'), where('parentId', '==', parentId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * submitEnrollmentRequest(parentId, formData)
 * Called from parent dashboard to enroll a child.
 */
export async function submitEnrollmentRequest(parentId, formData) {
  return await addDoc(collection(db, 'enrollment_requests'), {
    parentId,
    studentName:  formData.studentName,
    studentEmail: formData.studentEmail || '',
    subjects:     formData.subjects     || [],
    plan:         formData.plan         || '',
    schedule:     formData.schedule     || '',
    amount:       formData.amount       || 0,
    status:       'pending',
    createdAt:    serverTimestamp()
  });
}

// ════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════
export function fmtDate(ts) {
  if (!ts) return '—';
  try {
    return ts.toDate().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch (e) { return '—'; }
}

export function timeAgo(ts) {
  if (!ts) return 'just now';
  const diff = Date.now() - (ts.toDate?.() ?? new Date(ts)).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export { db as firestore, auth as firebaseAuth };