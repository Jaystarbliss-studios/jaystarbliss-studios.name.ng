const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const studentResourcesJS = `
<script type="module">
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy, where, serverTimestamp, setDoc, getDoc, updateDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
const db = getFirestore();

// Helper
function emptyMsg(msg) { return '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">' + msg + '</div>'; }
function fmtDate(ts) {
  if (!ts) return '';
  let d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

async function loadStudentResources() {
  var grid = document.getElementById('studentResourcesGrid');
  if(!grid) return;
  grid.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">Loading...</div>';
  try {
    var snap = await getDocs(query(collection(db, 'studentResources'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No student resources sent yet'); return; }
    grid.innerHTML = '';
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';
      let url = data.url || data.fileUrl || '';
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="\${data.type === 'link' ? 'link' : 'file-text'}" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="user" class="w-3 h-3"></i> \${data.studentId}</span>
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        \${data.description ? \`<p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description}</p>\` : ''}
        <div class="mt-auto pt-3 flex flex-col gap-2 border-t border-outline-variant">
          \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="external-link" class="w-4 h-4"></i> View</a>\` : ''}
          <div class="flex justify-end mt-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteStudentResource('\${docSnap.id}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>\`;
      setTimeout(() => window.lucide && lucide.createIcons({ root: card }), 0);
      grid.appendChild(card);
    });
  } catch(e) { grid.innerHTML = emptyMsg('Error loading student resources'); }
}
setTimeout(loadStudentResources, 500);
window.deleteStudentResource = async function(id) { if(confirm('Delete resource?')) { await deleteDoc(doc(db, 'studentResources', id)); loadStudentResources(); } };

setTimeout(() => {
  const schoolExamForm = document.getElementById('schoolExamForm');
  if(schoolExamForm) {
    schoolExamForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'POSTING...';
      try {
        await addDoc(collection(db, 'schoolExams'), {
          title: document.getElementById('schoolExamTitle').value,
          schoolId: document.getElementById('schoolSelect').value,
          url: document.getElementById('schoolExamUrl').value,
          description: document.getElementById('schoolExamDescription').value,
          timestamp: serverTimestamp()
        });
        schoolExamForm.reset();
        if(typeof loadSchoolExams === 'function') loadSchoolExams();
        alert('School Exam posted!');
      } catch(err) { alert(err.message); }
      btn.disabled = false; btn.textContent = 'POST_SCHOOL_EXAM';
    });
  }

  const schoolResourceForm = document.getElementById('schoolResourceForm');
  if(schoolResourceForm) {
    schoolResourceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'POSTING...';
      try {
        await addDoc(collection(db, 'schoolResources'), {
          title: document.getElementById('schoolResourceTitle').value,
          schoolId: document.getElementById('schoolResourceSchool').value,
          url: document.getElementById('schoolResourceUrl').value,
          description: document.getElementById('schoolResourceDescription').value,
          type: document.getElementById('schoolResourceType').value,
          timestamp: serverTimestamp()
        });
        schoolResourceForm.reset();
        if(typeof loadSchoolResources === 'function') loadSchoolResources();
        alert('School Resource posted!');
      } catch(err) { alert(err.message); }
      btn.disabled = false; btn.textContent = 'POST_SCHOOL_RESOURCE';
    });
  }

  const studentResourceForm = document.getElementById('studentResourceForm');
  if(studentResourceForm) {
    studentResourceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'SENDING...';
      try {
        await addDoc(collection(db, 'studentResources'), {
          studentId: document.getElementById('targetStudent').value,
          title: document.getElementById('studentResourceTitle').value,
          url: document.getElementById('studentResourceUrl').value,
          description: document.getElementById('studentResourceDescription').value,
          type: 'link', // or 'resource'
          timestamp: serverTimestamp()
        });
        studentResourceForm.reset();
        loadStudentResources();
        alert('Student Resource sent!');
      } catch(err) { alert(err.message); }
      btn.disabled = false; btn.textContent = 'TRANSMIT_RESOURCE';
    });
  }
}, 1000);
</script>
`;

html = html.replace('</body></html>', studentResourcesJS + '\n</body></html>');
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed missing items in admin-dashboard.html v3");
