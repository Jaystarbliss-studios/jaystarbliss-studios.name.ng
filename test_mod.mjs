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

const bcrypt = (typeof window !== 'undefined' && window.dcodeIO) ? window.dcodeIO.bcrypt : (typeof window !== 'undefined' ? window.bcrypt : null);

localStorage.setItem('jdh_firebase_config', JSON.stringify(FIREBASE_CONFIG));
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';
const functions = getFunctions(app);
export { functions, httpsCallable };


// ════════════════════════════════════════════════════
// ACCESS CODE GENERATOR
// Generates a random 6–8 character alphanumeric code.
// ════════════════════════════════════════════════════
export function generateAccessCode(length = 12) {
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
      // Legacy check
      const snap = await getDocs(
        query(collection(db, 'students'), where('uid', '==', uid))
      );
      if (!snap.empty) {
        const data = snap.docs[0].data();
        let sType = data.studentType;
        if (!sType) {
          console.warn('[JDH] Student missing studentType. Defaulting to private.');
          sType = 'private';
        }
        _saveSession(snap.docs[0].id, data, 'student', sType);
        window.location.href = '/pages/dashboard/student-portal.html';
        return;
      }
      window.location.href = '/pages/auth/login.html';
      return;
    }
    const data = userDoc.data();
    const role = data.role;
    _saveSession(uid, data, role);
    
    if (role === 'admin')       window.location.href = '/pages/dashboard/admin-dashboard.html';
    else if (role === 'staff')  window.location.href = '/pages/dashboard/staff-portal.html';
    else if (role === 'parent') window.location.href = '/pages/dashboard/parent-portal.html';
    else if (role === 'tutor')  window.location.href = '/pages/dashboard/tutor-portal.html';
    else if (role === 'schoolAdmin') window.location.href = '/pages/dashboard/school-portal.html';
    else if (role === 'student') {
      let sType = data.studentType;
      if (!sType) {
        console.warn('[JDH] Student missing studentType. Defaulting to private.');
        sType = 'private';
      }
      window.location.href = '/pages/dashboard/student-portal.html';
    } else {
      window.location.href = '/pages/auth/login.html';
    }
  } catch (e) {
    console.error('[JDH] routeByRole error:', e);
    window.location.href = '/pages/auth/login.html';
  }
}

function _saveSession(uid, data, role, studentType) {
  const rememberMe = localStorage.getItem('jdh_remember_me') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  
  storage.setItem('userId',    uid);
  storage.setItem('userRole',  role);
  if (studentType) storage.setItem('studentType', studentType);
  storage.setItem('userEmail', data.email || '');
  storage.setItem('userName',  data.name  || data.fullName || '');
  if (data.parentId)  storage.setItem('parentId',  data.parentId);
  if (data.studentId) storage.setItem('studentId', data.studentId);
}

export function _clearSession() {
  sessionStorage.clear();
  // Keep jdh_remember_me but clear user specific stuff
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('studentType');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('parentId');
  localStorage.removeItem('studentId');
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
    if (user) { syncTheme(user.uid); }
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
    const emailNorm = email.trim().toLowerCase();
    const checkLimit = httpsCallable(functions, 'checkLoginRateLimit');
    const { data: limitData } = await checkLimit({ email: emailNorm });
    
    if (!limitData.allowed) {
      alert('Too many failed attempts. Please try again in ' + limitData.minutesRemaining + ' minutes.');
      return null;
    }

    const snap = await getDocs(
      query(
        collection(db, 'students'),
        where('email', '==', emailNorm)
      )
    );
    
    const recordFailed = httpsCallable(functions, 'recordFailedLogin');
    
    if (snap.empty) {
      await recordFailed({ email: emailNorm });
      return null;
    }
    
    const d = snap.docs[0];
    const data = d.data();
    
    // Check if accessCodeExpiry is past
    if (data.accessCodeExpiry) {
      const now = new Date();
      const expiry = data.accessCodeExpiry.toDate ? data.accessCodeExpiry.toDate() : new Date(data.accessCodeExpiry);
      if (now > expiry) {
        console.error('[JDH] Access code expired');
        return { error: 'Access code expired' };
      }
    }
    
    let isValid = false;
    if (data.accessCodeHash) {
      isValid = bcrypt.compareSync(accessCode.trim(), data.accessCodeHash);
    } else {
      isValid = bcrypt.compareSync(accessCode.trim(), data.accessCode);
      if (accessCode.trim() === data.accessCode) isValid = true;
    }
    
    if (!isValid) {
      await recordFailed({ email: emailNorm });
      return null;
    }
    
    const resetLimit = httpsCallable(functions, 'resetLoginRateLimit');
    await resetLimit({ email: emailNorm });
    
    return { id: d.id, ...data };
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
  
  const data = reqSnap.data();
  const plainAccessCode = generateAccessCode(12);
  const salt = bcrypt.genSaltSync(10);
  const hashedAccessCode = bcrypt.hashSync(plainAccessCode, salt);
  
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 90);
  
  const studentData = {
    uid:        null,          
    name:       data.name,
    email:      data.email.toLowerCase(),
    accessCode: hashedAccessCode,
    accessCodeExpiry: expiry,
    studentType: 'private',
    authType: 'accessCode',
    schoolId: null,
    parentId:   data.parentId  || null,
    subjects:   data.subjects  || [],
    role:       'student',
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp()
  };

  await setDoc(doc(db, 'students', requestId), studentData);

  const afterUpdate = {
    status:     'approved',
    studentId:  requestId,
    approvedAt: serverTimestamp()
  };

  await updateDoc(reqRef, afterUpdate);
  
  await logAudit('approve_student_request', 'student_requests', requestId, data, { ...data, ...afterUpdate });
  
  return plainAccessCode; // return for display
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
  let studentId = data.studentId || null;
  let plainAccessCode = null;
  
  if (!studentId) {
    plainAccessCode = generateAccessCode(12);
    const salt = bcrypt.genSaltSync(10);
    const hashedAccessCode = bcrypt.hashSync(plainAccessCode, salt);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);
    
    const newStudentRef = doc(collection(db, 'students'));
    studentId = newStudentRef.id;
    
    const studentData = {
      uid: null,
      name: data.studentName,
      email: (data.studentEmail || '').toLowerCase(),
      accessCode: hashedAccessCode,
      accessCodeExpiry: expiry,
      studentType: 'independent',
      authType: 'accessCode',
      schoolId: null,
      parentId: data.parentId,
      subjects: data.subjects || [],
      schedule: data.schedule || '',
      plan: data.plan || '',
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(newStudentRef, studentData);
    
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
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);
    if(studentSnap.exists()){
       await updateDoc(studentRef, {
         parentId: data.parentId,
         subjects: data.subjects || [],
         schedule: data.schedule || '',
         plan:     data.plan     || '',
         updatedAt: serverTimestamp()
       });
    }
  }

  const parentRef  = doc(db, 'parents', data.parentId);
  const parentSnap = await getDoc(parentRef);
  if (parentSnap.exists()) {
    const children = parentSnap.data().children || [];
    if (!children.includes(studentId)) {
      await updateDoc(parentRef, { children: [...children, studentId] });
    }
  }

  const afterUpdate = {
    status:     'approved',
    studentId,
    approvedAt: serverTimestamp()
  };
  await updateDoc(enrRef, afterUpdate);
  
  await logAudit('approve_enrollment', 'enrollment_requests', enrollmentId, data, { ...data, ...afterUpdate });
  
  return { studentId, plainAccessCode };
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
export async function logAudit(action, collectionName, docId, before, after) {
  try {
    const storage = localStorage.getItem('userId') ? localStorage : sessionStorage;
    const userId = storage.getItem('userId') || 'system';
    const userRole = storage.getItem('userRole') || 'system';
    
    await addDoc(collection(db, 'audit_logs'), {
      userId,
      userRole,
      action,
      collection: collectionName,
      docId,
      before: before || null,
      after: after || null,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error('[JDH] logAudit error:', e);
  }
}

// ════════════════════════════════════════════════════
// ERROR HANDLING & TOAST
// ════════════════════════════════════════════════════
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '1rem';
  toast.style.borderRadius = '8px';
  toast.style.color = '#fff';
  toast.style.zIndex = '9999';
  
  if (type === 'error') toast.style.background = '#dc2626';
  else if (type === 'success') toast.style.background = '#16a34a';
  else if (type === 'warning') toast.style.background = '#ca8a04';
  else toast.style.background = '#2563eb';

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export async function logError(error, contextInfo) {
  console.error('[JDH]', contextInfo, error);
  try {
    await addDoc(collection(db, 'error_logs'), {
      error: error.message || error.toString(),
      context: contextInfo,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    // Ignore error logging failure
  }
}


// ════════════════════════════════════════════════════
// THEME SYNC
// ════════════════════════════════════════════════════
export async function syncTheme(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists() && userDoc.data().theme) {
      const dbTheme = userDoc.data().theme;
      const localTheme = localStorage.getItem('jdh-theme');
      if (dbTheme !== localTheme) {
        localStorage.setItem('jdh-theme', dbTheme);
        if (dbTheme === 'dark') { document.documentElement.classList.add('dark'); document.documentElement.setAttribute('data-theme', 'dark'); }
        else { document.documentElement.classList.remove('dark'); document.documentElement.setAttribute('data-theme', 'light'); }
        // If lucide icons exist
        if (window.lucide) {
           const icon = document.getElementById('themeIcon');
           if (icon) {
             icon.setAttribute('data-lucide', dbTheme === 'dark' ? 'moon' : 'sun');
             lucide.createIcons();
           }
        }
      }
    }
  } catch(e) {}
}

export async function saveTheme(themeStr) {
  localStorage.setItem('jdh-theme', themeStr);
  if (themeStr === 'dark') { document.documentElement.classList.add('dark'); document.documentElement.setAttribute('data-theme', 'dark'); }
  else { document.documentElement.classList.remove('dark'); document.documentElement.setAttribute('data-theme', 'light'); }
  const uid = localStorage.getItem('userId');
  if (uid) {
    try {
      await updateDoc(doc(db, 'users', uid), { theme: themeStr });
    } catch(e) {
      console.log('Error saving theme to DB:', e);
    }
  }
}

// Attach saveTheme to window
window.jdhSaveTheme = saveTheme;

window.jdhShowToast = showToast;
window.jdhLogError = logError;
