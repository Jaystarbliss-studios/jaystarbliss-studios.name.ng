const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const regex = /function createPostCard\(data, id, type\) \{[\s\S]*?loadStaffList\(\);/m;

const replacement = `function createPostCard(data, id, type) {
  var card = document.createElement('div');
  card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';
  var cat = data.category === 'both' ? 'All Students' : data.category === 'school' ? 'School' : 'Private';
  let iconName = type === 'resource' ? 'book-open' : type === 'link' ? 'link' : 'file-question';
  let badgeColor = type === 'exam' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container';
  let url = data.url || data.fileUrl || '';
  let delFunc = type === 'resource' ? 'deleteResource' : type === 'link' ? 'deleteLink' : 'deleteExam';
  
  card.innerHTML = \`
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg \${badgeColor} flex items-center justify-center flex-shrink-0">
          <i data-lucide="\${iconName}" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
            <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="tag" class="w-3 h-3"></i> \${cat}</span>
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
    \${data.description ? \`<p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description}</p>\` : ''}
    <div class="mt-auto pt-3 flex flex-col gap-2 border-t border-outline-variant">
      \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="\${type==='link'?'external-link':'paperclip'}" class="w-4 h-4"></i> \${type==='link'?'View External Link':'Open File'}</a>\` : ''}
      <div class="flex justify-end mt-2">
        <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="\${delFunc}('\${id}')">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
        </button>
      </div>
    </div>\`;
  setTimeout(() => lucide.createIcons({ root: card }), 0);
  return card;
}

window.deleteResource = async function(id) { if(confirm('Delete resource?')) { await deleteDoc(doc(db, 'resources', id)); loadResources(); } };
window.deleteLink = async function(id) { if(confirm('Delete link?')) { await deleteDoc(doc(db, 'links', id)); loadLinks(); } };
window.deleteExam = async function(id) { if(confirm('Delete exam?')) { await deleteDoc(doc(db, 'exams', id)); loadExams(); } };

async function loadSchoolExams() {
  var grid = document.getElementById('schoolExamsGrid');
  if(!grid) return;
  grid.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">Loading...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'schoolExams'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No school exams posted yet'); return; }
    grid.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';
      let url = data.url || data.fileUrl || '';
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="file-question" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
              <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="school" class="w-3 h-3"></i> \${SCHOOL_NAMES[data.schoolId] || data.schoolId}</span>
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        \${data.description ? \`<p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description}</p>\` : ''}
        <div class="mt-auto pt-3 flex flex-col gap-2 border-t border-outline-variant">
          \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="external-link" class="w-4 h-4"></i> View Exam</a>\` : ''}
          <div class="flex justify-end mt-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteSchoolExam('\${docSnap.id}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>\`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      grid.appendChild(card);
    });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading school exams'); }
}
loadSchoolExams();
window.deleteSchoolExam = async function(id) { if(confirm('Delete school exam?')) { await deleteDoc(doc(db, 'schoolExams', id)); loadSchoolExams(); } };

async function loadSchoolResources() {
  var grid = document.getElementById('schoolResourcesGrid');
  if(!grid) return;
  grid.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">Loading...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'schoolResources'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No school resources posted yet'); return; }
    grid.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';
      let url = data.url || data.fileUrl || '';
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="\${data.type === 'link' ? 'link' : 'file-text'}" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="school" class="w-3 h-3"></i> \${SCHOOL_NAMES[data.schoolId] || data.schoolId}</span>
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="tag" class="w-3 h-3"></i> \${data.type}</span>
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        \${data.description ? \`<p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description}</p>\` : ''}
        <div class="mt-auto pt-3 flex flex-col gap-2 border-t border-outline-variant">
          \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="external-link" class="w-4 h-4"></i> View</a>\` : ''}
          <div class="flex justify-end mt-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteSchoolResource('\${docSnap.id}', '\${data.type}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>\`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      grid.appendChild(card);
    });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading school resources'); }
}
loadSchoolResources();
window.deleteSchoolResource = async function(id, type) { if(confirm('Delete resource?')) { await deleteDoc(doc(db, 'schoolResources', id)); loadSchoolResources(); } };

async function loadStudentsList() {
  var container = document.getElementById('studentsListContainer');
  if(!container) return;
  container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">Loading...</div>';
  try {
    var snap = await getDocs(collection(db, 'students'));
    if (snap.empty) { container.innerHTML = emptyMsg('No students registered yet'); return; }
    container.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="user" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.fullName || data.username}</h3>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="at-sign" class="w-3 h-3"></i> \${data.username}</span>
                \${data.email ? \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="mail" class="w-3 h-3"></i> \${data.email}</span>\` : ''}
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.registeredAt)}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 items-end">
             <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteStudent('\${docSnap.id}')">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
             </button>
             \${data.authType === 'firebase' ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-bold border border-green-200">Firebase Auth</span>' : \`<button class="px-2 py-1 bg-surface border border-outline text-xs rounded hover:bg-surface-container-high transition-colors" onclick="upgradeToFirebaseAuth('\${docSnap.id}')">Upgrade Auth</button>\`}
          </div>
        </div>
        <div class="mt-auto pt-3 flex flex-col gap-2 border-t border-outline-variant">
           <label class="text-xs font-bold text-on-surface-variant">Update Access Code</label>
           <div class="flex items-center gap-2">
              <input type="text" id="code_\${docSnap.id}" value="\${data.accessCode}" class="text-sm p-1.5 border border-outline-variant rounded-md flex-1 bg-surface focus:outline-none focus:border-primary" placeholder="New access code">
              <button class="px-3 py-1.5 text-xs font-semibold bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors" onclick="updateStudentCode('\${docSnap.id}')">Update Code</button>
           </div>
        </div>\`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      container.appendChild(card);
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading students'); }
}
loadStudentsList();

window.deleteStudent = async function(id) {
  if (confirm('Delete this student? This cannot be undone.')) {
    try { await deleteDoc(doc(db, 'students', id)); loadStudentsList(); } catch(e) { alert(e.message); }
  }
};
window.updateStudentCode = async function(id) {
  const code = document.getElementById('code_' + id).value;
  if (!code) return alert('Enter a code');
  try { await updateDoc(doc(db, 'students', id), { accessCode: code }); alert('Code updated!'); loadStudentsList(); } catch(e) { alert(e.message); }
};
window.upgradeToFirebaseAuth = async function(studentId) {
  if(!confirm('Upgrade this student to Firebase Auth? An account will be created with their email.')) return;
  try {
    const studentDoc = await getDoc(doc(db, 'students', studentId));
    const data = studentDoc.data();
    if(!data.email) throw new Error('Student has no email address. Cannot upgrade.');
    const result = await firebaseCreateUser({ email: data.email, password: data.accessCode, displayName: data.fullName || data.username });
    if(result.error) throw new Error(result.error);
    await updateDoc(doc(db, 'students', studentId), { authType: 'firebase', uid: result.uid });
    alert('Upgraded to Firebase Auth successfully!');
    loadStudentsList();
  } catch(e) { alert(e.message); }
};

async function loadStaffList() {
  var container = document.getElementById('staffListContainer');
  if(!container) return;
  container.innerHTML = '<div style="padding:1rem;color:var(--text-dim);font-size:.75rem;font-family:var(--mono);">Loading...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'staff')));
    if (snap.empty) { container.innerHTML = '<div style="padding:1.5rem;color:var(--text-dim);font-size:.75rem;text-align:center;font-family:var(--mono);">No staff members yet</div>'; return; }
    container.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="user-check" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.name}</h3>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                \${data.email ? \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="mail" class="w-3 h-3"></i> \${data.email}</span>\` : ''}
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.createdAt)}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 items-end">
             <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteStaff('\${docSnap.id}')">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove
             </button>
          </div>
        </div>\`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      container.appendChild(card);
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading staff'); }
}
loadStaffList();`;

code = code.replace(regex, replacement);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
