const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// For loadStudentsList
code = code.replace(
/card\.innerHTML =[\s\S]*?'<input type="text" id="code_' \+ docSnap\.id \+ '" value="' \+ data\.accessCode \+ '" placeholder="New access code">'[\s\S]*?\+ '<button class="btn btn-secondary btn-sm" onclick="updateStudentCode\\(''\+docSnap\.id\+''\\)'"\>Update\<\/button\>\<\/div\>';/m,
`card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative';
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
      setTimeout(() => lucide.createIcons({ root: card }), 0);`
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
