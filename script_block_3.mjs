
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import {
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup
  } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
  import {
    getFirestore, doc, getDoc, setDoc, collection,
    addDoc, getDocs, query, where, serverTimestamp, updateDoc
  } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

  const firebaseConfig = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

  const app  = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db   = getFirestore(app);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');


  import { loginWithAccessCode } from '../../assets/js/jdh-firebase-modules.js';

  const STAFF_REG_CODE_FALLBACK = 'JAYSTAR2024';

  const REDIRECTS = {
    admin:             '../dashboard/admin-dashboard.html',
    school:            '../dashboard/school-portal.html',
    schoolAdmin:       '../school/school-admin-portal.html',
    staff:             '../dashboard/staff-portal.html',
    parent:            '../dashboard/parent-portal.html',
    individualStudent: '../dashboard/student-portal.html',
  };

  // ── Helpers ──
  function showMsg(id, text, type) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = 'msg msg-' + type + ' show';
  }
  function hideMsg(id) {
    var el = document.getElementById(id);
    if (el) el.className = 'msg msg-error';
  }
  function setBtnLoading(id, on) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = on;
    btn.classList.toggle('loading', on);
  }
  function writeSession(role, uid, email, name, extra) {
    localStorage.setItem('userRole',  role);
    localStorage.setItem('userId',    uid);
    localStorage.setItem('userEmail', email || '');
    localStorage.setItem('userName',  name  || '');
    if (extra) Object.entries(extra).forEach(([k,v]) => localStorage.setItem(k, v));
  }
  // Derives a deterministic internal Firebase Auth email from a student username.
  // Never exposed to users.
  function studentAuthEmail(username) {
    return username.toLowerCase().replace(/[^a-z0-9]/g, '') + '@jdh-student.local';
  }

  // ══════════════════════════════════════════════════════
  // GOOGLE LOGIN  (parent + staff)
  // ══════════════════════════════════════════════════════
  async function googleLogin(expectedRole, errId, btnId) {
    hideMsg(errId);
    setBtnLoading(btnId, true);
    try {
      const result   = await signInWithPopup(auth, googleProvider);
      const user     = result.user;
      const userSnap = await getDoc(doc(db, 'users', user.uid));

      if (!userSnap.exists()) {
        // No Firestore record — auto-create for first-time parent Google sign-in
        if (expectedRole === 'parent') {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email, name: user.displayName || '',
            role: 'parent', createdAt: serverTimestamp()
          });
          writeSession('parent', user.uid, user.email, user.displayName || '');
          window.location.href = REDIRECTS.parent;
          return;
        }
        throw new Error('No account found. Please register first or contact your admin.');
      }

      const userData = userSnap.data();
      const role     = userData.role;

      if (role === 'admin') {
        writeSession('admin', user.uid, user.email, userData.name || '');
        window.location.href = REDIRECTS.admin;
        return;
      }
      if (role === 'schoolAdmin' && expectedRole === 'school') expectedRole = 'schoolAdmin'; // Allow school admin to login via school tab
      if (role !== expectedRole) {
        throw new Error('This Google account is registered as "' + role + '". Please use the correct tab.');
      }
      writeSession(role, user.uid, user.email, userData.name || '',
        userData.name ? { staffName: userData.name } : null);
      window.location.href = REDIRECTS[role] || REDIRECTS.school;

    } catch(e) {
      let msg = 'Google sign-in failed. Please try again.';
      if (e.code === 'auth/popup-closed-by-user') msg = 'Sign-in cancelled.';
      else if (e.code === 'auth/popup-blocked')   msg = 'Popup blocked — please allow popups and retry.';
      else if (e.message) msg = e.message;
      showMsg(errId, msg, 'error');
      setBtnLoading(btnId, false);
    }
  }

  document.getElementById('btn-google-parent').addEventListener('click', () =>
    googleLogin('parent', 'err-parent', 'btn-google-parent'));
  document.getElementById('btn-google-staff').addEventListener('click', () =>
    googleLogin('staff', 'err-staff', 'btn-google-staff'));

  // ══════════════════════════════════════════════════════
  // EMAIL LOGIN  (school, staff, parent, admin)
  // ══════════════════════════════════════════════════════
  async function emailLogin(email, password, expectedRole, errId, btnId) {
    hideMsg(errId);
    setBtnLoading(btnId, true);
    try {
      const cred     = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const role     = userData.role;

      if (role === 'admin') {
        writeSession('admin', cred.user.uid, email, userData.name || '');
        window.location.href = REDIRECTS.admin;
        return;
      }
      if (role !== expectedRole) {
        throw new Error('Wrong tab for this account. Please use the ' + role + ' tab.');
      }
      writeSession(role, cred.user.uid, email, userData.name || '',
        userData.name ? { staffName: userData.name } : null);
      window.location.href = REDIRECTS[role] || REDIRECTS.school;

    } catch(e) {
      let msg = 'Invalid credentials. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || e.code === 'auth/invalid-login-credentials') msg = 'No account found with that email.';
      if (e.code === 'auth/wrong-password')    msg = 'Incorrect password.';
      if (e.code === 'auth/invalid-email')     msg = 'Invalid email address.';
      if (e.code === 'auth/too-many-requests') msg = 'Too many attempts. Please wait a moment.';
      if (e.message && (e.message.includes('tab') || e.message.includes('role'))) msg = e.message;
      showMsg(errId, msg, 'error');
      setBtnLoading(btnId, false);
    }
  }

  document.getElementById('form-school').addEventListener('submit', function(e) {
    e.preventDefault();
    emailLogin(document.getElementById('school-email').value.trim(), document.getElementById('school-pw').value, 'school', 'err-school', 'btn-school');
  });
  document.getElementById('form-parent').addEventListener('submit', function(e) {
    e.preventDefault();
    emailLogin(document.getElementById('parent-email').value.trim(), document.getElementById('parent-pw').value, 'parent', 'err-parent', 'btn-parent');
  });
  document.getElementById('form-staff').addEventListener('submit', function(e) {
    e.preventDefault();
    emailLogin(document.getElementById('staff-email').value.trim(), document.getElementById('staff-pw').value, 'staff', 'err-staff', 'btn-staff');
  });

  // ══════════════════════════════════════════════════════
  // STUDENT LOGIN
  //
  // Students see only username + access code.
  // Internally we sign them into Firebase Auth with a derived
  // email so Firestore security rules work via request.auth.uid.
  //
  // CRITICAL SESSION KEYS:
  //   studentDocId = Firestore doc ID → used for resource queries
  //   userId       = Firebase Auth UID → used for auth/rules checks
  //
  // These are DIFFERENT values and must both be stored.
  // ══════════════════════════════════════════════════════
  
  
  document.getElementById('form-student').addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMsg('err-student');
    setBtnLoading('btn-student', true);

    const email = document.getElementById('student-user').value.trim();
    const codeOrPassword = document.getElementById('student-code').value.trim();
    
    try {
      let firebaseUid = null;
      let isFirebaseAuth = false;
      
      // Try Firebase Auth First
      try {
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const cred = await signInWithEmailAndPassword(auth, email, codeOrPassword);
        firebaseUid = cred.user.uid;
        isFirebaseAuth = true;
      } catch(authErr) {
        // Fall back to access code logic
      }
      
      if (isFirebaseAuth) {
        // Find student doc
        const snap = await getDocs(query(collection(db, 'students'), where('uid', '==', firebaseUid)));
        if (snap.empty) {
          throw new Error('Student record not found for this account.');
        }
        const studentData = snap.docs[0].data();
        
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userId', firebaseUid);
        localStorage.setItem('studentDocId', snap.docs[0].id);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', studentData.name || studentData.fullName || '');
        localStorage.setItem('studentType', studentData.studentType || 'private');
        
        if (studentData.studentType === 'school') {
          window.location.href = REDIRECTS.individualStudent; // Actually student-portal
        } else {
          window.location.href = '../dashboard/private-student-portal.html';
        }
        return;
      }

      // Access Code Fallback
      const studentData = await loginWithAccessCode(email, codeOrPassword);
      if (!studentData) {
         throw new Error('Invalid email, password, or access code.');
      }
      if (studentData.error) {
         throw new Error(studentData.error);
      }
      
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userId', studentData.id);
      localStorage.setItem('studentDocId', studentData.id);
      localStorage.setItem('userEmail', studentData.email || email);
      localStorage.setItem('userName', studentData.name || studentData.fullName || '');
      localStorage.setItem('studentType', studentData.studentType || 'private');
      
      if (studentData.studentType === 'school') {
        window.location.href = REDIRECTS.individualStudent;
      } else {
        window.location.href = '../dashboard/private-student-portal.html';
      }
    } catch(e) {
      showMsg('err-student', e.message || 'Login failed.', 'error');
      setBtnLoading('btn-student', false);
    }
  });

  // ══════════════════════════════════════════════════════
  // STUDENT REGISTRATION
  // ══════════════════════════════════════════════════════
  document.getElementById('form-student-reg').addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMsg('err-student-reg'); hideMsg('ok-student-reg');
    setBtnLoading('btn-student-reg', true);

    const fullName = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const code     = document.getElementById('reg-code').value.trim();

    try {
      const usernameSnap = await getDocs(query(collection(db,'students'), where('username','==',username)));
      if (!usernameSnap.empty) throw new Error('Username already taken. Choose another.');

      const codeSnap = await getDocs(query(collection(db,'students'), where('accessCode','==',code)));
      if (codeSnap.empty) throw new Error('Invalid access code. Please get your code from your instructor.');

      const fakeEmail = studentAuthEmail(username);
      let firebaseUid;
      try {
        const cred  = await createUserWithEmailAndPassword(auth, fakeEmail, code);
        firebaseUid = cred.user.uid;
      } catch(authErr) {
        if (authErr.code === 'auth/email-already-in-use') throw new Error('Username already registered. Try logging in instead.');
        throw authErr;
      }

      await addDoc(collection(db, 'students'), {
        fullName, username, email: email || '',
        accessCode: code, firebaseUid, authEmail: fakeEmail,
        registeredAt: serverTimestamp()
      });

      showMsg('ok-student-reg', '✓ Account created! You can now log in.', 'success');
      document.getElementById('form-student-reg').reset();
      setTimeout(function() {
        document.getElementById('student-register-view').style.display = 'none';
        document.getElementById('student-login-view').style.display    = 'block';
      }, 1800);
    } catch(e) {
      showMsg('err-student-reg', e.message || 'Registration failed.', 'error');
    }
    setBtnLoading('btn-student-reg', false);
  });

  // ══════════════════════════════════════════════════════
  // STAFF REGISTRATION
  // ══════════════════════════════════════════════════════
  document.getElementById('form-staff-reg').addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMsg('err-staff-reg'); hideMsg('ok-staff-reg');
    setBtnLoading('btn-staff-reg', true);

    const regCode = document.getElementById('sreg-code').value.trim();
    const name    = document.getElementById('sreg-name').value.trim();
    const email   = document.getElementById('sreg-email').value.trim();
    const pw      = document.getElementById('sreg-pw').value;
    const pw2     = document.getElementById('sreg-pw2').value;

    if (pw !== pw2)    { showMsg('err-staff-reg','Passwords do not match.','error'); setBtnLoading('btn-staff-reg',false); return; }
    if (pw.length < 6) { showMsg('err-staff-reg','Password must be at least 6 characters.','error'); setBtnLoading('btn-staff-reg',false); return; }

    try {
      const codeSnap  = await getDoc(doc(db,'staffRegistration','code'));
      const validCode = codeSnap.exists() ? codeSnap.data().code : STAFF_REG_CODE_FALLBACK;
      if (regCode !== validCode) throw new Error('Invalid registration code. Contact your admin.');

      const cred = await createUserWithEmailAndPassword(auth, email, pw);
      await setDoc(doc(db,'users',cred.user.uid), { email, name, role:'staff', createdAt:serverTimestamp() });

      showMsg('ok-staff-reg','✓ Account created! You can now log in.','success');
      document.getElementById('form-staff-reg').reset();
      setTimeout(function() {
        document.getElementById('staff-register-view').style.display = 'none';
        document.getElementById('staff-login-view').style.display    = 'block';
      }, 2000);
    } catch(e) {
      let txt = 'Registration failed.';
      if (e.code === 'auth/email-already-in-use') txt = 'Email already registered. Try logging in.';
      else if (e.code === 'auth/invalid-email')   txt = 'Invalid email address.';
      else if (e.code === 'auth/weak-password')   txt = 'Password is too weak (min 6 chars).';
      else if (e.message) txt = e.message;
      showMsg('err-staff-reg', txt, 'error');
    }
    setBtnLoading('btn-staff-reg', false);
  });
