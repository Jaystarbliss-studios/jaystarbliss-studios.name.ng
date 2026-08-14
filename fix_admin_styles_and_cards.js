const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Replace createPostCard
code = code.replace(/function createPostCard[\s\S]*?return card;\n\}/, `function createPostCard(data, id, type) {
  var card = document.createElement('div');
  card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
  var cat = data.category === 'both' ? 'All Students' : data.category === 'school' ? 'School' : 'Private';
  
  let iconName = type === 'resource' ? 'book-open' : type === 'link' ? 'link' : 'file-question';
  let badgeColor = type === 'exam' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container';
  
  card.innerHTML = \`
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg \${badgeColor} flex items-center justify-center flex-shrink-0">
          <i data-lucide="\${iconName}" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
            <span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="users" class="w-3 h-3"></i> \${cat}</span>
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description}</p>
    <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
      \${data.fileUrl ? \`<a href="\${data.fileUrl}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="paperclip" class="w-4 h-4"></i> Open Attached File</a>\` : ''}
      \${data.url ? \`<a href="\${data.url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="external-link" class="w-4 h-4"></i> View External Link</a>\` : ''}
      <div class="flex justify-end mt-2">
        <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deletePost('\${id}', '\${type}')">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
        </button>
      </div>
    </div>
  \`;
  setTimeout(() => lucide.createIcons({ root: card }), 0);
  return card;
}`);

// Replace loadSchoolResources card creation
code = code.replace(/card\.innerHTML\s*=\s*'<h3>'[\s\S]*?return card;\n\s*\}/g, `card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
        card.innerHTML = \`
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                <i data-lucide="\${item.type === 'link' ? 'link' : 'file-text'}" class="w-5 h-5"></i>
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
          <p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description}</p>
          <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
            \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="\${item.type === 'link' ? 'external-link' : 'paperclip'}" class="w-4 h-4"></i> \${item.type === 'link' ? 'View External Link' : 'Open Attached File'}</a>\` : ''}
            <div class="flex justify-end mt-2">
              <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteSchoolRes('\${d.id}', '\${item.type}')">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
              </button>
            </div>
          </div>
        \`;
        setTimeout(() => lucide.createIcons({ root: card }), 0);
        return card;
      }`);

// We also need to fix loadStudentResources card creation
code = code.replace(/card\.innerHTML\s*=\s*'<div><h3>👤'[\s\S]*?return card;\n\s*\}/g, `card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
        card.innerHTML = \`
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
                <i data-lucide="user" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.fullName || data.username}</h3>
                <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                  <span class="flex items-center gap-1"><i data-lucide="mail" class="w-3 h-3"></i> \${data.email || 'No email'}</span>
                  <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.registeredAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-outline-variant text-sm">
             <div class="font-mono bg-surface-container px-3 py-2 rounded-lg text-center font-bold tracking-widest">\${data.accessCode}</div>
          </div>
        \`;
        setTimeout(() => lucide.createIcons({ root: card }), 0);
        return card;
      }`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
