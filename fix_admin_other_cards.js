const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// We will selectively rewrite the body of loadStudentResources and loadStaffResources
// Let's use string split or exact string replacement.

// First, fix loadStudentResources
code = code.replace(/async function loadStudentResources\(\) \{[\s\S]*?loadStudentResources\(\);/, `async function loadStudentResources() {
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
      var card  = document.createElement('div'); 
      card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
      
      let resUrl = res.url || res.fileUrl;
      let isLink = res.col === 'personalLinks';
      
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="user" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${res.title}</h3>
              <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="user-check" class="w-3 h-3"></i> \${sName}</span>
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(res.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${res.description || 'No description provided.'}</p>
        <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
          \${resUrl ? \`<a href="\${resUrl}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="\${isLink ? 'external-link' : 'paperclip'}" class="w-4 h-4"></i> View Resource</a>\` : ''}
          <div class="flex justify-end mt-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteStudentResource('\${res.id}', '\${res.col}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>
      \`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      grid.appendChild(card);
    }
  } catch(e) { console.error(e); grid ? (grid.innerHTML = '<pre>' + e.stack + '</pre>') : (container.innerHTML = '<pre>' + e.stack + '</pre>'); grid.innerHTML = emptyMsg('Error loading resources'); }
}
loadStudentResources();`);


// Next, fix loadStaffResources
code = code.replace(/async function loadStaffResources\(\) \{[\s\S]*?loadStaffResources\(\);/, `async function loadStaffResources() {
  var grid = document.getElementById('staffResourcesGrid');
  grid.innerHTML = '';
  try {
    var snap = await getDocs(query(collection(db, 'staffGeneralResources'), orderBy('timestamp', 'desc')));
    if (snap.empty) { grid.innerHTML = emptyMsg('No resources posted yet'); return; }
    snap.forEach(function(docSnap) {
      var data = docSnap.data();
      var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
      
      let resUrl = data.url || data.fileUrl;
      let isLink = !!data.url;
      
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-surface-tint/10 text-surface-tint flex items-center justify-center flex-shrink-0">
              <i data-lucide="\${isLink ? 'link' : 'file-text'}" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
              <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="users" class="w-3 h-3"></i> Staff General</span>
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description || 'No description provided.'}</p>
        <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
          \${resUrl ? \`<a href="\${resUrl}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="\${isLink ? 'external-link' : 'paperclip'}" class="w-4 h-4"></i> View Resource</a>\` : ''}
          <div class="flex justify-end mt-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteStaffResource('\${docSnap.id}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>
      \`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      grid.appendChild(card);
    });
  } catch(e) { console.error(e); grid ? (grid.innerHTML = '<pre>' + e.stack + '</pre>') : (container.innerHTML = '<pre>' + e.stack + '</pre>'); grid.innerHTML = emptyMsg('Error loading staff resources'); }
}
loadStaffResources();`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
