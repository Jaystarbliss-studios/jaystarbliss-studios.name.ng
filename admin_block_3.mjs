
import { initializeApp }      from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword
}
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy, where, serverTimestamp, setDoc, getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ── Firebase init ──
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
const adminAuth = getAuth(app);

function studentAuthEmail(username) {
  return username.toLowerCase().replace(/[^a-z0-9]/g, '') + '@jdh-student.local';
}

// ── FIX 1: Monitor real Firebase Auth state, not just sessionStorage ──
onAuthStateChanged(auth, function(user) {
  if (!user) {
    sessionStorage.clear();
    window.location.href = '../auth/login.html';
    return;
  }
  // Double-check role from sessionStorage (set on login)
  if (sessionStorage.getItem('userRole') !== 'admin') {
    window.location.href = '../auth/login.html';
  }
});

// Populate email display
document.getElementById('adminEmail').textContent =
  sessionStorage.getItem('userEmail') || 'ADMIN@JDH.IO';

// Set registration link
document.getElementById('regLink').textContent =
  window.location.origin + '/staff-register.html';

// ── Logout ──
window._doLogout = async function() {
  await signOut(auth);
  sessionStorage.clear();
  window.location.href = '../auth/login.html';
};

// ── Utility: show success banner ──
function showSuccess(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 3000);
}

// ── Utility: date format ──
function fmtDate(ts) {
  if (!ts) return '';
  try { return new Date(ts.toDate()).toLocaleDateString(); } catch(e) { return ''; }
}

// ── Load live stats ──
async function loadStats() {
  try {
    var [studSnap, staffSnap] = await Promise.all([
      getDocs(collection(db, 'students')),
      getDocs(query(collection(db, 'users'), where('role', '==', 'staff')))
    ]);
    document.getElementById('statStudents').textContent = studSnap.size;
    document.getElementById('statStaff').textContent    = staffSnap.size;
  } catch(e) { console.error('loadStats:', e); }
}
loadStats();

// ════════════════════════════════════════════════════
// GENERAL RESOURCES
// ════════════════════════════════════════════════════
document.getElementById('resourceForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'resources'), {
      title:       document.getElementById('resourceTitle').value.trim(),
      category:    document.getElementById('resourceCategory').value,
      description: document.getElementById('resourceDescription').value.trim(),
      fileUrl:     document.getElementById('resourceUrl').value.trim(),
      timestamp:   serverTimestamp()
    });
    showSuccess('resourceSuccess');
    this.reset();
    loadResources();
  } catch(e) { alert('Error posting resource: ' + e.message); }
});

async function loadResources() {
  var grid = document.getElementById('resourcesGrid');
  grid.innerHTML = '';
  try {
    var snap = await getDocs(query(collection(db, 'resources'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No resources posted yet'); return; }
    snap.forEach(function(d) { grid.appendChild(createPostCard(d.data(), d.id, 'resource')); });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading resources'); }
}
loadResources();

// ════════════════════════════════════════════════════
// LINKS
// ════════════════════════════════════════════════════
document.getElementById('linkForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'links'), {
      title:       document.getElementById('linkTitle').value.trim(),
      category:    document.getElementById('linkCategory').value,
      url:         document.getElementById('linkUrl').value.trim(),
      description: document.getElementById('linkDescription').value.trim(),
      timestamp:   serverTimestamp()
    });
    showSuccess('linkSuccess');
    this.reset();
    document.getElementById('linkPreviewContainer').innerHTML = '';
    loadLinks();
  } catch(e) { alert('Error posting link: ' + e.message); }
});

document.getElementById('previewLinkBtn').addEventListener('click', function() {
  var url = document.getElementById('linkUrl').value.trim();
  if (url) document.getElementById('linkPreviewContainer').innerHTML =
    '<iframe src="' + url + '" class="preview-frame"></iframe>';
});

async function loadLinks() {
  var grid = document.getElementById('linksGrid');
  grid.innerHTML = '';
  try {
    var snap = await getDocs(query(collection(db, 'links'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No links posted yet'); return; }
    snap.forEach(function(d) { grid.appendChild(createPostCard(d.data(), d.id, 'link')); });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading links'); }
}
loadLinks();

// ════════════════════════════════════════════════════
// EXAMS
// ════════════════════════════════════════════════════
document.getElementById('examForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'exams'), {
      title:       document.getElementById('examTitle').value.trim(),
      category:    document.getElementById('examCategory').value,
      url:         document.getElementById('examUrl').value.trim(),
      description: document.getElementById('examDescription').value.trim(),
      timestamp:   serverTimestamp()
    });
    showSuccess('examSuccess');
    this.reset();
    document.getElementById('examPreviewContainer').innerHTML = '';
    loadExams();
  } catch(e) { alert('Error posting exam: ' + e.message); }
});

document.getElementById('previewExamBtn').addEventListener('click', function() {
  var url = document.getElementById('examUrl').value.trim();
  if (url) document.getElementById('examPreviewContainer').innerHTML =
    '<iframe src="' + url + '" class="preview-frame"></iframe>';
});

async function loadExams() {
  var grid = document.getElementById('examsGrid');
  grid.innerHTML = '';
  try {
    var snap = await getDocs(query(collection(db, 'exams'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No exams posted yet'); return; }
    snap.forEach(function(d) { grid.appendChild(createPostCard(d.data(), d.id, 'exam')); });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading exams'); }
}
loadExams();

// ── Shared post-card factory ──
function createPostCard(data, id, type) {
  var card = document.createElement('div');
  card.className = 'post-card';
  var cat = data.category === 'both' ? 'All Students' : data.category === 'school' ? 'School' : 'Private';
  card.innerHTML =
    '<h3>' + data.title + '</h3>'
    + '<div class="post-meta"><span>📚 ' + cat + '</span><span>' + fmtDate(data.timestamp) + '</span></div>'
    + '<p>' + data.description + '</p>'
    + (data.fileUrl ? '<p><strong>📎 Link:</strong> <a href="' + data.fileUrl + '" target="_blank">Open File</a></p>' : '')
    + (data.url     ? '<p><strong>🔗 URL:</strong> <a href="' + data.url     + '" target="_blank">View</a></p>'      : '')
    + '<div class="post-actions"><button class="btn btn-danger btn-sm" onclick="deletePost(\'' + id + '\',\'' + type + '\')">DELETE</button></div>';
  return card;
}

window.deletePost = async function(id, type) {
  if (!confirm('Delete this post?')) return;
  var colName = type === 'resource' ? 'resources' : type === 'link' ? 'links' : 'exams';
  try {
    await deleteDoc(doc(db, colName, id));
    if      (type === 'resource') loadResources();
    else if (type === 'link')     loadLinks();
    else                          loadExams();
  } catch(e) { alert('Error deleting: ' + e.message); }
};

// ════════════════════════════════════════════════════
// SCHOOL EXAMS
// ════════════════════════════════════════════════════
const SCHOOL_NAMES = {
  peniel:'Peniel Lily Montessori', southgold:'South Gold Montessori',
  sapphire:'Sapphire Explorer',    easystars:'Easy Stars Academy',
  christycaleb:'Christy Caleb International', royalbreed:'Royal Breed Academy'
};

document.getElementById('schoolExamForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'schoolExams'), {
      title:       document.getElementById('schoolExamTitle').value.trim(),
      schoolId:    document.getElementById('schoolSelect').value,
      url:         document.getElementById('schoolExamUrl').value.trim(),
      description: document.getElementById('schoolExamDescription').value.trim(),
      timestamp:   serverTimestamp()
    });
    showSuccess('schoolExamSuccess');
    this.reset();
    loadSchoolExams();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadSchoolExams() {
  var grid = document.getElementById('schoolExamsGrid');
  grid.innerHTML = '';
  try {
    var snap = await getDocs(query(collection(db, 'schoolExams'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No school exams posted yet'); return; }
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div'); card.className = 'post-card';
      card.innerHTML =
        '<h3>' + data.title + '</h3>'
        + '<div class="post-meta"><span>🏫 ' + (SCHOOL_NAMES[data.schoolId] || data.schoolId) + '</span><span>' + fmtDate(data.timestamp) + '</span></div>'
        + '<p>' + data.description + '</p>'
        + '<p><strong>🔗 URL:</strong> <a href="' + data.url + '" target="_blank">View</a></p>'
        + '<div class="post-actions"><button class="btn btn-danger btn-sm" onclick="deleteSchoolExam(\'' + docSnap.id + '\')">DELETE</button></div>';
      grid.appendChild(card);
    });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading school exams'); }
}
loadSchoolExams();

window.deleteSchoolExam = async function(id) {
  if (!confirm('Delete this school exam?')) return;
  await deleteDoc(doc(db, 'schoolExams', id));
  loadSchoolExams();
};

// ════════════════════════════════════════════════════
// SCHOOL RESOURCES
// ════════════════════════════════════════════════════
document.getElementById('schoolResourceForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var resourceType = document.getElementById('schoolResourceType').value;
  var colName  = resourceType === 'link' ? 'schoolLinks' : 'schoolResources';
  var urlField = resourceType === 'link' ? 'url' : 'fileUrl';
  try {
    await addDoc(collection(db, colName), {
      schoolId:    document.getElementById('schoolResourceSchool').value,
      title:       document.getElementById('schoolResourceTitle').value.trim(),
      [urlField]:  document.getElementById('schoolResourceUrl').value.trim(),
      description: document.getElementById('schoolResourceDescription').value.trim(),
      timestamp:   serverTimestamp()
    });
    showSuccess('schoolResourceSuccess');
    this.reset();
    loadSchoolResources();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadSchoolResources() {
  var grid = document.getElementById('schoolResourcesGrid');
  grid.innerHTML = '';
  try {
    var [rSnap, lSnap] = await Promise.all([
      getDocs(query(collection(db, 'schoolResources'), orderBy('timestamp', 'desc'))),
      getDocs(query(collection(db, 'schoolLinks'),     orderBy('timestamp', 'desc')))
    ]);
    var all = [];
    rSnap.forEach(function(d) { all.push({ id:d.id, data:d.data(), type:'resource', col:'schoolResources' }); });
    lSnap.forEach(function(d) { all.push({ id:d.id, data:d.data(), type:'link',     col:'schoolLinks'     }); });
    all.sort(function(a, b) {
      return (b.data.timestamp?.toDate() || new Date(0)) - (a.data.timestamp?.toDate() || new Date(0));
    });
    if (!all.length) { grid.innerHTML = emptyMsg('No school resources posted yet'); return; }
    all.forEach(function(item) {
      var data = item.data;
      var url  = item.type === 'link' ? data.url : data.fileUrl;
      var card = document.createElement('div'); card.className = 'post-card';
      card.innerHTML =
        '<h3>' + (item.type === 'link' ? '🔗' : '📄') + ' ' + data.title + '</h3>'
        + '<div class="post-meta"><span>🏫 ' + (SCHOOL_NAMES[data.schoolId] || data.schoolId) + '</span><span>' + fmtDate(data.timestamp) + '</span></div>'
        + '<p>' + data.description + '</p>'
        + '<p><strong>🔗 URL:</strong> <a href="' + url + '" target="_blank">View</a></p>'
        + '<div class="post-actions"><button class="btn btn-danger btn-sm" onclick="deleteSchoolResource(\'' + item.id + '\',\'' + item.col + '\')">DELETE</button></div>';
      grid.appendChild(card);
    });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading school resources'); }
}
loadSchoolResources();

window.deleteSchoolResource = async function(id, colName) {
  if (!confirm('Delete this school resource?')) return;
  await deleteDoc(doc(db, colName, id));
  loadSchoolResources();
};

// ════════════════════════════════════════════════════
// MANAGE SCHOOLS
// ════════════════════════════════════════════════════
window.updateSchoolCode = async function(schoolId) {
  var input = document.getElementById(schoolId + 'Code');
  if (!input.value.trim()) { alert('Please enter an access code'); return; }
  try {
    await setDoc(doc(db, 'schools', schoolId), { accessCode: input.value.trim(), updatedAt: serverTimestamp() });
    showSuccess('schoolManageSuccess');
    input.value = '';
  } catch(e) { alert('Error: ' + e.message); }
};

// ════════════════════════════════════════════════════

window.upgradeToFirebaseAuth = async function(docId) {
  if (!confirm('Upgrade this student to Firebase Auth? They will receive a temporary password.')) return;
  try {
    const { httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js');
    const { functions } = await import('../../assets/js/jdh-firebase-modules.js');
    const upgradeFunc = httpsCallable(functions, 'createFirebaseAccountForStudent');
    const res = await upgradeFunc({ studentId: docId });
    if (res.data.success) {
      alert('Upgraded! Temp Password: ' + res.data.tempPassword);
      loadStudentsList();
    } else {
      alert('Upgrade failed: ' + res.data.message);
    }
  } catch(e) {
    alert('Error: ' + e.message);
  }
};

// MANAGE STUDENTS
// ════════════════════════════════════════════════════
document.getElementById('addStudentForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var fullName = document.getElementById('newStudentName').value.trim();
  var username = document.getElementById('newStudentUsername').value.trim();
  var email    = document.getElementById('newStudentEmail').value.trim();
  var code     = document.getElementById('newStudentCode').value.trim();
  try {
    var existing = await getDocs(query(collection(db, 'students'), where('username', '==', username)));
    if (!existing.empty) { alert('Username already exists! Choose another.'); return; }
    await addDoc(collection(db, 'students'), {
      fullName, username, email, accessCode: code, registeredAt: serverTimestamp()
    });
    showSuccess('studentAddSuccess');
    this.reset();
    loadStudentsList();
    loadStudentsDropdown();
    loadStats();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadStudentsList() {
  var container = document.getElementById('studentsListContainer');
  container.innerHTML = '';
  try {
    var snap = await getDocs(collection(db, 'students'));
    if (snap.empty) { container.innerHTML = '<div style="padding:2rem;color:var(--text-dim);font-size:.75rem;text-align:center;font-family:var(--mono);">No students registered yet</div>'; return; }
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div'); card.className = 'person-card';
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:start;gap:.5rem;margin-bottom:.6rem;flex-wrap:wrap;">'
        + '<div><h3>👤 ' + (data.fullName || data.username) + '</h3>'
        + '<p><strong>Username:</strong> ' + data.username + '<br>'
        + (data.email ? '<strong>Email:</strong> ' + data.email + '<br>' : '')
        + '<strong>Code:</strong> <span style="font-family:var(--mono);color:var(--crimson);">' + data.accessCode + '</span><br>'
        + (data.authType === 'firebase' ? '<span style="color:var(--green); font-size:0.8rem; border: 1px solid var(--green); padding: 2px 4px; border-radius: 4px;">Firebase Auth Active</span><br>' : '<button class="btn btn-secondary btn-sm" onclick="upgradeToFirebaseAuth(\'' + docSnap.id + '\')" style="margin-top: 5px;">Upgrade to Firebase Auth</button><br>')

        + '<strong>Registered:</strong> ' + fmtDate(data.registeredAt) + '</p></div>'
        + '<button class="btn btn-danger btn-sm" onclick="deleteStudent(\'' + docSnap.id + '\')">DELETE</button>'
        + '</div>'
        + '<div class="form-group" style="margin-bottom:.4rem;"><label>Update Access Code</label>'
        + '<input type="text" id="code_' + docSnap.id + '" value="' + data.accessCode + '" placeholder="New access code">'
        + '</div>'
        + '<button class="btn btn-primary btn-sm" onclick="updateStudentCode(\'' + docSnap.id + '\')">UPDATE CODE</button>';
      container.appendChild(card);
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading students'); }
}
loadStudentsList();

window.updateStudentCode = async function(docId) {
  const newCode = document.getElementById('code_' + docId).value.trim();
  if (!newCode) { alert('Enter an access code'); return; }
  try {
    const studentSnap = await getDoc(doc(db, 'students', docId));
    if (!studentSnap.exists()) { alert('Student record not found.'); return; }
    const studentData = studentSnap.data();
    const username = studentData.username;
    const fakeEmail = studentAuthEmail(username);

    await setDoc(doc(db, 'students', docId), { accessCode: newCode }, { merge: true });

    try {
      let authUser;
      try {
        const cred = await signInWithEmailAndPassword(adminAuth, fakeEmail, studentData.accessCode);
        authUser = cred.user;
      } catch(signInErr) {
        if (
          signInErr.code === 'auth/user-not-found' ||
          signInErr.code === 'auth/invalid-credential' ||
          signInErr.code === 'auth/wrong-password'
        ) {
          const cred = await createUserWithEmailAndPassword(adminAuth, fakeEmail, newCode);
          authUser = cred.user;
          await setDoc(doc(db, 'students', docId), {
            firebaseUid: authUser.uid,
            authEmail: fakeEmail
          }, { merge: true });
        } else {
          throw signInErr;
        }
      }

      await updatePassword(authUser, newCode);
      await adminAuth.signOut();

      alert('✅ Access code updated in both Firestore and Firebase Auth!\n\nNew code: ' + newCode);
    } catch(authErr) {
      console.warn('[JDH] Auth password sync failed (Firestore was updated):', authErr.message);
      alert(
        '⚠️ Access code saved in Firestore, but Firebase Auth sync failed.\n\n' +
        'The student may need to re-register or contact support.\n\n' +
        'Error: ' + authErr.message
      );
    }

    loadStudentsList();
  } catch(e) {
    alert('Error updating access code: ' + e.message);
  }
};

window.deleteStudent = async function(docId) {
  if (!confirm('Delete this student and all their resources?')) return;
  try {
    const studentSnap = await getDoc(doc(db, 'students', docId));
    const studentData = studentSnap.exists() ? studentSnap.data() : null;

    await deleteDoc(doc(db, 'students', docId));

    const [rSnap, lSnap] = await Promise.all([
      getDocs(query(collection(db, 'personalResources'), where('studentId', '==', docId))),
      getDocs(query(collection(db, 'personalLinks'),     where('studentId', '==', docId)))
    ]);
    const dels = [];
    rSnap.forEach(function(d) { dels.push(deleteDoc(d.ref)); });
    lSnap.forEach(function(d) { dels.push(deleteDoc(d.ref)); });
    await Promise.all(dels);

    if (studentData && studentData.username) {
      const fakeEmail = studentAuthEmail(studentData.username);
      try {
        const cred = await signInWithEmailAndPassword(adminAuth, fakeEmail, studentData.accessCode);
        await cred.user.delete();
        console.log('[JDH] Firebase Auth account deleted for', studentData.username);
      } catch(authErr) {
        console.warn('[JDH] Could not delete Auth account (may not exist):', authErr.message);
      }
    }

    loadStudentsList();
    loadStudentsDropdown();
    loadStats();
  } catch(e) {
    alert('Error deleting student: ' + e.message);
  }
};

async function loadStudentsDropdown() {
  var dd = document.getElementById('targetStudent');
  dd.innerHTML = '<option value="">Choose Student</option>';
  try {
    var snap = await getDocs(collection(db, 'students'));
    snap.forEach(function(d) {
      var data = d.data();
      var opt  = document.createElement('option');
      opt.value       = d.id;
      opt.textContent = (data.fullName || data.username) + ' (@' + data.username + ')';
      dd.appendChild(opt);
    });
  } catch(e) { console.error('loadStudentsDropdown:', e); }
}
loadStudentsDropdown();

// ════════════════════════════════════════════════════
// SEND RESOURCES TO STUDENT
// ════════════════════════════════════════════════════
document.getElementById('studentResourceForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var studentId = document.getElementById('targetStudent').value;
  var type      = document.getElementById('resourceType').value;
  var title     = document.getElementById('studentResourceTitle').value.trim();
  var url       = document.getElementById('studentResourceUrl').value.trim();
  var desc      = document.getElementById('studentResourceDescription').value.trim();
  var colName   = type === 'link' ? 'personalLinks' : 'personalResources';
  var urlField  = type === 'link' ? 'url' : 'fileUrl';
  try {
    await addDoc(collection(db, colName), {
      studentId, title, [urlField]: url, description: desc, timestamp: serverTimestamp()
    });
    showSuccess('studentResourceSuccess');
    this.reset();
    loadStudentResources();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadStudentResources() {
  var grid = document.getElementById('studentResourcesGrid');
  grid.innerHTML = '';
  try {
    var all = [];
    for (var colName of ['personalResources', 'personalLinks']) {
      var snap = await getDocs(query(collection(db, colName), orderBy('timestamp', 'desc')));
      snap.forEach(function(d) { all.push({ id:d.id, col:colName, ...d.data() }); });
    }
    all.sort(function(a, b) { return (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0); });
    if (!all.length) { grid.innerHTML = emptyMsg('No resources sent yet'); return; }
    for (var res of all.slice(0, 10)) {
      var sDoc  = await getDoc(doc(db, 'students', res.studentId));
      var sName = sDoc.exists() ? (sDoc.data().fullName || sDoc.data().username) : 'Unknown';
      var card  = document.createElement('div'); card.className = 'post-card';
      card.innerHTML =
        '<h3>' + res.title + '</h3>'
        + '<div class="post-meta"><span>👤 ' + sName + '</span><span>' + fmtDate(res.timestamp) + '</span></div>'
        + '<p>' + res.description + '</p>'
        + '<p><strong>🔗:</strong> <a href="' + (res.url || res.fileUrl) + '" target="_blank">View</a></p>'
        + '<div class="post-actions"><button class="btn btn-danger btn-sm" onclick="deleteStudentResource(\'' + res.id + '\',\'' + res.col + '\')">DELETE</button></div>';
      grid.appendChild(card);
    }
  } catch(e) { grid.innerHTML = emptyMsg('Error loading resources'); }
}
loadStudentResources();

window.deleteStudentResource = async function(id, colName) {
  if (confirm('Delete this resource?')) {
    await deleteDoc(doc(db, colName, id));
    loadStudentResources();
  }
};

// ════════════════════════════════════════════════════
// MANAGE STAFF
// ════════════════════════════════════════════════════
document.getElementById('addStaffForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var name  = document.getElementById('staffName').value.trim();
  var email = document.getElementById('staffEmail').value.trim();
  try {
    await addDoc(collection(db, 'pendingStaff'), {
      email, name, invitedAt: serverTimestamp(),
      invitedBy: sessionStorage.getItem('userId')
    });
    await setDoc(doc(db, 'staffRegistration', 'code'), { code:'JAYSTAR2024', updatedAt: serverTimestamp() });
    showSuccess('staffAddSuccess');
    alert('✅ Staff invitation created!\n\nSend to ' + name + ':\nEmail: ' + email + '\n🔑 Code: JAYSTAR2024\n🔗 Link: ' + window.location.origin + '/staff-register.html');
    this.reset();
    loadStaffList();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadStaffList() {
  var container = document.getElementById('staffListContainer');
  container.innerHTML = '<div style="padding:1rem;color:var(--text-dim);font-size:.75rem;font-family:var(--mono);">Loading...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'staff')));
    if (snap.empty) { container.innerHTML = '<div style="padding:1.5rem;color:var(--text-dim);font-size:.75rem;text-align:center;font-family:var(--mono);">No staff members yet</div>'; return; }
    container.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div'); card.className = 'person-card';
      card.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:.5rem;">'
        + '<div><h3>👨‍🏫 ' + data.name + '</h3>'
        + '<p><strong>Email:</strong> ' + data.email + '<br>'
        + '<strong>Added:</strong> ' + fmtDate(data.createdAt) + '</p></div>'
        + '<button class="btn btn-danger btn-sm" onclick="deleteStaff(\'' + docSnap.id + '\')">REMOVE</button>'
        + '</div>';
      container.appendChild(card);
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading staff'); }
}
loadStaffList();

window.deleteStaff = async function(id) {
  if (!confirm('Remove this staff member?')) return;
  try {
    await deleteDoc(doc(db, 'users', id));
    loadStaffList();
    loadStats();
  } catch(e) { alert('Error: ' + e.message); }
};

// ════════════════════════════════════════════════════
// STAFF RESOURCES
// ════════════════════════════════════════════════════
document.getElementById('staffResourceForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'staffGeneralResources'), {
      title:       document.getElementById('staffResTitle').value.trim(),
      url:         document.getElementById('staffResUrl').value.trim(),
      description: document.getElementById('staffResDescription').value.trim(),
      timestamp:   serverTimestamp()
    });
    showSuccess('staffResourceSuccess');
    this.reset();
    loadStaffResources();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadStaffResources() {
  var grid = document.getElementById('staffResourcesGrid');
  grid.innerHTML = '';
  try {
    var snap = await getDocs(query(collection(db, 'staffGeneralResources'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No resources posted yet'); return; }
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div'); card.className = 'post-card';
      card.innerHTML =
        '<h3>' + data.title + '</h3>'
        + '<p>' + data.description + '</p>'
        + '<p><strong>📎:</strong> <a href="' + data.url + '" target="_blank">Open</a></p>'
        + '<div class="post-actions"><button class="btn btn-danger btn-sm" onclick="deleteStaffResource(\'' + docSnap.id + '\')">DELETE</button></div>';
      grid.appendChild(card);
    });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading staff resources'); }
}
loadStaffResources();

window.deleteStaffResource = async function(id) {
  if (confirm('Delete this resource?')) {
    await deleteDoc(doc(db, 'staffGeneralResources', id));
    loadStaffResources();
  }
};

// ════════════════════════════════════════════════════
// STAFF SCHOOL ACCESS
// ════════════════════════════════════════════════════
document.getElementById('updateAccessCodeBtn').addEventListener('click', async function() {
  var code = document.getElementById('schoolAccessCodeInput').value.trim();
  if (!code) { alert('Please enter a code'); return; }
  try {
    await setDoc(doc(db, 'staffSchoolAccess', 'accessCode'), { code, updatedAt: serverTimestamp() });
    showSuccess('accessCodeSuccess');
    loadCurrentAccessCode();
  } catch(e) { alert('Error: ' + e.message); }
});

async function loadCurrentAccessCode() {
  try {
    var snap = await getDoc(doc(db, 'staffSchoolAccess', 'accessCode'));
    document.getElementById('currentAccessCode').textContent =
      snap.exists() ? snap.data().code : 'Not set';
  } catch(e) { document.getElementById('currentAccessCode').textContent = 'Error loading'; }
}
loadCurrentAccessCode();

// ════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════
document.getElementById('notifRecipient').addEventListener('change', async function() {
  var val    = this.value;
  var group  = document.getElementById('specificRecipientGroup');
  var select = document.getElementById('specificRecipient');

  if (val === 'specific_staff' || val === 'specific_student') {
    group.style.display = 'block';
    select.innerHTML    = '<option value="">Loading...</option>';
    try {
      if (val === 'specific_staff') {
        var snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'staff')));
        select.innerHTML = '<option value="">Choose staff member</option>';
        snap.forEach(function(d) {
          var data = d.data();
          var o = document.createElement('option');
          o.value = d.id; o.textContent = data.name + ' (' + data.email + ')';
          select.appendChild(o);
        });
      } else {
        var snap = await getDocs(collection(db, 'students'));
        select.innerHTML = '<option value="">Choose student</option>';
        snap.forEach(function(d) {
          var data = d.data();
          var o = document.createElement('option');
          o.value = d.id; o.textContent = data.fullName || data.username;
          select.appendChild(o);
        });
      }
    } catch(e) { select.innerHTML = '<option value="">Error loading</option>'; }
  } else {
    group.style.display = 'none';
  }
});

document.getElementById('notificationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var recipient = document.getElementById('notifRecipient').value;
  var specific  = document.getElementById('specificRecipient').value;
  var title     = document.getElementById('notifTitle').value.trim();
  var message   = document.getElementById('notifMessage').value.trim();

  if ((recipient === 'specific_staff' || recipient === 'specific_student') && !specific) {
    alert('Please select a person');
    return;
  }
  var recipientId = (recipient === 'specific_staff' || recipient === 'specific_student') ? specific : recipient;
  try {
    await addDoc(collection(db, 'notifications'), {
      recipientId, title, message, read: false, timestamp: serverTimestamp()
    });
    showSuccess('notificationSuccess');
    this.reset();
    document.getElementById('specificRecipientGroup').style.display = 'none';
  } catch(e) { alert('Error: ' + e.message); }
});

// ════════════════════════════════════════════════════
// ACTIVITY LOGS
// ════════════════════════════════════════════════════
async function loadActivityLogs() {
  var container     = document.getElementById('activityLogsContainer');
  var showLogins    = document.getElementById('filterLogins').checked;
  var showResources = document.getElementById('filterResources').checked;
  container.innerHTML = '<div style="padding:2rem;color:var(--text-dim);font-size:.75rem;text-align:center;font-family:var(--mono);">Loading...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc')));
    if (snap.empty) { container.innerHTML = emptyMsg('No activity yet'); return; }
    container.innerHTML = '';
    const ICONS = { login:'🔓', logout:'🔒', staff_resource_sent:'📤', staff_school_resource_sent:'🏫', student_added:'👤' };
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      if (!showLogins    && (data.type === 'login' || data.type === 'logout')) return;
      if (!showResources && data.type && data.type.includes('resource'))       return;
      var desc = {
        login:                    (data.userType || '') + ' logged in: '  + (data.userEmail || ''),
        logout:                   (data.userType || '') + ' logged out: ' + (data.userEmail || ''),
        staff_resource_sent:      'Staff ' + data.staffEmail + ' sent "' + data.resourceTitle + '" to a student',
        staff_school_resource_sent:'Staff ' + data.staffEmail + ' sent "' + data.resourceTitle + '" to a school',
        student_added:            'Staff ' + data.staffEmail + ' added student: ' + data.studentUsername
      }[data.type] || data.type;
      var item = document.createElement('div'); item.className = 'log-item';
      item.innerHTML =
        '<div class="log-icon">' + (ICONS[data.type] || '📊') + '</div>'
        + '<div><div class="log-text">' + desc + '</div>'
        + '<div class="log-time">' + (data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : '') + '</div></div>';
      container.appendChild(item);
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading logs'); }
}
loadActivityLogs();

document.getElementById('refreshLogsBtn').addEventListener('click', loadActivityLogs);

// ════════════════════════════════════════════════════
// NEWS CORNER — FIX: single addEventListener, flag-based edit mode
// ════════════════════════════════════════════════════
const CAT_ICONS  = { announcement:'📢', event:'🎉', achievement:'🏆', update:'🔔', holiday:'🎄' };
const CAT_LABELS = { announcement:'Announcement', event:'Event', achievement:'Achievement', update:'Update', holiday:'Holiday Special' };

// Tracks which document is being edited (null = create mode)
let _editingNewsId   = null;
let _editingNewsData = null; // cached for preserving timestamp/views on update

document.getElementById('newsForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var payload = {
    title:    document.getElementById('newsTitle').value.trim(),
    category: document.getElementById('newsCategory').value,
    author:   document.getElementById('newsAuthor').value.trim(),
    excerpt:  document.getElementById('newsExcerpt').value.trim(),
    content:  document.getElementById('newsContent').value.trim(),
    imageUrl: document.getElementById('newsImage').value.trim() || ''
  };

  try {
    if (_editingNewsId) {
      // ── UPDATE mode: preserve original timestamp and views ──
      await setDoc(doc(db, 'newsCorner', _editingNewsId), {
        ...payload,
        timestamp: _editingNewsData.timestamp,
        views:     _editingNewsData.views || 0
      });
      _resetNewsForm();
      alert('News post updated!');
    } else {
      // ── CREATE mode ──
      await addDoc(collection(db, 'newsCorner'), {
        ...payload,
        timestamp: serverTimestamp(),
        views:     0
      });
      showSuccess('newsSuccess');
      this.reset();
    }
    loadNewsCorner();
  } catch(e) { alert('Error: ' + e.message); }
});

function _resetNewsForm() {
  _editingNewsId   = null;
  _editingNewsData = null;
  document.getElementById('newsForm').reset();
  var btn = document.getElementById('newsSubmitBtn');
  btn.textContent     = 'PUBLISH_POST';
  btn.style.background   = '';
  btn.style.borderColor  = '';
  btn.style.color        = '';
}

// Exposed to inline onclick in post cards
window.editNewsPost = function(docId, dataStr) {
  var data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
  _editingNewsId   = docId;
  _editingNewsData = data;

  document.getElementById('newsTitle').value    = data.title    || '';
  document.getElementById('newsCategory').value = data.category || '';
  document.getElementById('newsAuthor').value   = data.author   || '';
  document.getElementById('newsExcerpt').value  = data.excerpt  || '';
  document.getElementById('newsContent').value  = data.content  || '';
  document.getElementById('newsImage').value    = data.imageUrl || '';

  var btn = document.getElementById('newsSubmitBtn');
  btn.textContent     = 'UPDATE_POST';
  btn.style.background   = 'rgba(56,189,248,0.15)';
  btn.style.borderColor  = 'rgba(56,189,248,0.4)';
  btn.style.color        = 'var(--blue)';

  document.getElementById('newsCorner').scrollIntoView({ behavior:'smooth' });
};

async function loadNewsCorner() {
  var grid = document.getElementById('newsGrid');
  grid.innerHTML = '<div style="padding:2rem;color:var(--text-dim);font-size:.75rem;font-family:var(--mono);">Loading news posts...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'newsCorner'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No news posts yet'); return; }
    grid.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      // Safely serialize data for inline onclick (avoid injection via title/etc.)
      var safeData = JSON.stringify({
        title:    data.title    || '',
        category: data.category || '',
        author:   data.author   || '',
        excerpt:  data.excerpt  || '',
        content:  data.content  || '',
        imageUrl: data.imageUrl || '',
        views:    data.views    || 0,
        // timestamp: skipped (non-serialisable Firestore Timestamp)
      });
      var card = document.createElement('div'); card.className = 'post-card';
      var imgPrev = data.imageUrl
        ? '<img src="' + data.imageUrl + '" style="width:100%;height:120px;object-fit:cover;margin-bottom:.6rem;border-radius:6px;" alt="" loading="lazy">'
        : '';
      card.innerHTML =
        imgPrev
        + '<h3>' + data.title + '</h3>'
        + '<div class="post-meta"><span>' + (CAT_ICONS[data.category] || '📰') + ' ' + (CAT_LABELS[data.category] || data.category) + '</span><span>👁️ ' + (data.views || 0) + ' views</span></div>'
        + '<p>' + data.excerpt + '</p>'
        + '<div class="post-meta" style="border-top:1px solid var(--border);padding-top:.45rem;margin-top:.35rem;"><span>✍️ ' + data.author + '</span><span>' + fmtDate(data.timestamp) + '</span></div>'
        + '<div class="post-actions" style="margin-top:.55rem;">'
        + '<button class="btn btn-blue btn-sm" onclick=\'editNewsPost("' + docSnap.id + '",' + safeData.replace(/'/g,"&#39;") + ')\'>EDIT</button>'
        + '<button class="btn btn-danger btn-sm" onclick="deleteNewsPost(\'' + docSnap.id + '\')">DELETE</button>'
        + '</div>';
      grid.appendChild(card);
    });

    // Also cache timestamps for edit use (Firestore Timestamp not JSON-serialisable)
    window._newsTimestamps = {};
    snap.forEach(function(d) { window._newsTimestamps[d.id] = d.data().timestamp; });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading news'); }
}
loadNewsCorner();

// Patch editNewsPost to restore timestamp from cache
var _origEdit = window.editNewsPost;
window.editNewsPost = function(docId, dataStr) {
  _origEdit(docId, dataStr);
  // Restore the non-serialisable Firestore timestamp from cache
  if (window._newsTimestamps && window._newsTimestamps[docId]) {
    _editingNewsData.timestamp = window._newsTimestamps[docId];
  }
};

window.deleteNewsPost = async function(id) {
  if (!confirm('Delete this news post?')) return;
  try {
    await deleteDoc(doc(db, 'newsCorner', id));
    // If we were editing this post, reset the form
    if (_editingNewsId === id) _resetNewsForm();
    loadNewsCorner();
  } catch(e) { alert('Error: ' + e.message); }
};

// ════════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════════
function emptyMsg(text) {
  return '<div style="padding:2rem;color:var(--text-dim);font-size:.75rem;font-family:var(--mono);text-align:center;">' + text + '</div>';
}
