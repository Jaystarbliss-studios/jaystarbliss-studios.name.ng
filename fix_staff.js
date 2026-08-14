const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// For loadStaffList
code = code.replace(
/card\.innerHTML =[\s\S]*?'\<div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:\.5rem;"\>'[\s\S]*?\+ '\<\/div\>';/m,
`card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative';
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
      setTimeout(() => lucide.createIcons({ root: card }), 0);`
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
