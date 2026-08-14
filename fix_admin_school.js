const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

code = code.replace(/var card = document.createElement\('div'\); card\.className = 'post-card';[\s\S]*?grid\.appendChild\(card\);\n\s*\}/g, `var card = document.createElement('div');
      card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
      var iconName = item.type === 'link' ? 'link' : 'file-text';
      var badgeColor = item.type === 'link' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container';
      
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg \${badgeColor} flex items-center justify-center flex-shrink-0">
              <i data-lucide="\${iconName}" class="w-5 h-5"></i>
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
        <p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description || 'No description provided.'}</p>
        <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
          \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="\${item.type === 'link' ? 'external-link' : 'paperclip'}" class="w-4 h-4"></i> \${item.type === 'link' ? 'View External Link' : 'Open Attached File'}</a>\` : ''}
          <div class="flex justify-end mt-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteSchoolResource('\${item.id}', '\${item.col}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
            </button>
          </div>
        </div>
      \`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      grid.appendChild(card);
    }`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
