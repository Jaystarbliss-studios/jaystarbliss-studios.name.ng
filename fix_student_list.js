const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

html = html.replace(`async function loadStudentsList() {
  var container = document.getElementById('studentsListContainer');
  if(!container) return;
  container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">Loading...</div>';
  try {
    var snap = await getDocs(collection(db, 'students'));
    if (snap.empty) { container.innerHTML = emptyMsg('No students registered yet'); return; }
    container.innerHTML = '';`, `async function loadStudentsList() {
  var container = document.getElementById('studentsListContainer');
  const targetStudentSelect = document.getElementById('targetStudent');
  if (targetStudentSelect) targetStudentSelect.innerHTML = '<option value="">Choose Student</option>';
  if(!container) return;
  container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-dim);font-size:.75rem;">Loading...</div>';
  try {
    var snap = await getDocs(collection(db, 'students'));
    if (snap.empty) { container.innerHTML = emptyMsg('No students registered yet'); return; }
    container.innerHTML = '';`);

html = html.replace(`setTimeout(() => lucide.createIcons({ root: card }), 0);
      container.appendChild(card);
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading students'); }
}`, `setTimeout(() => lucide.createIcons({ root: card }), 0);
      container.appendChild(card);
      if (targetStudentSelect) {
        const opt = document.createElement('option');
        opt.value = docSnap.id;
        opt.textContent = data.fullName || data.username || docSnap.id;
        targetStudentSelect.appendChild(opt);
      }
    });
  } catch(e) { container.innerHTML = emptyMsg('Error loading students'); }
}`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
