const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// For tutor applications
code = code.replace(
/card\.className = 'req-card';[\s\S]*?container\.appendChild\(card\);/m,
`card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm relative mb-4';
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
              <i data-lucide="graduation-cap" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.name || '—'}</h3>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                \${data.email ? \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="mail" class="w-3 h-3"></i> \${data.email}</span>\` : ''}
                \${data.phone ? \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="phone" class="w-3 h-3"></i> \${data.phone}</span>\` : ''}
                <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmtDate(data.createdAt)}</span>
              </div>
            </div>
          </div>
          \${statusTag(data.status || 'pending')}
        </div>
        <div class="text-sm text-on-surface-variant leading-relaxed">
            \${data.subjects ? \`<p class="m-0 mb-1"><strong>Subjects:</strong> \${Array.isArray(data.subjects) ? data.subjects.join(', ') : data.subjects}</p>\` : ''}
            \${data.experience ? \`<p class="m-0 mb-1"><strong>Experience:</strong> \${data.experience}</p>\` : ''}
            \${data.bio ? \`<p class="m-0 mt-2 bg-surface-container p-2 rounded text-xs">\${data.bio}</p>\` : ''}
        </div>
        \${data.status === 'pending' || data.status === 'paid' ? \`
          <div class="mt-auto pt-3 flex flex-col gap-3 border-t border-outline-variant">
             <div class="flex gap-2">
                <button class="flex-1 px-3 py-2 text-sm font-semibold rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors" id="approve_tutor_\${d.id}">
                  ✓ APPROVE
                </button>
                <button class="flex-1 px-3 py-2 text-sm font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" id="reject_tutor_\${d.id}">
                  ✗ REJECT
                </button>
             </div>
             <textarea class="w-full text-sm p-2 border border-outline-variant rounded-md bg-surface focus:outline-none focus:border-error resize-none" id="reason_tutor_\${d.id}" placeholder="Rejection reason (required to reject)" rows="2"></textarea>
          </div>\` : ''}\`;
      setTimeout(() => lucide.createIcons({ root: card }), 0);
      container.appendChild(card);`
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
