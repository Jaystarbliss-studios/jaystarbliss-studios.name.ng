const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

// The original makeCard takes innerHTML which looks like:
// <span class="pill pill-crimson">...</span>
// <h4>title</h4>
// <p>description</p>
// <a href="...">🔗 Link</a>
// <div class="card-meta">...</div>
// We can use a regex to parse these or replace the usage.
code = code.replace(/function makeCard[\s\S]*?return card;\n\}/, `function makeCard(data, type) {
  const card = document.createElement('div');
  card.className = 'bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group';
  
  let iconName = 'file-text';
  if(type === 'exam') iconName = 'file-question';
  if(type === 'link') iconName = 'link';
  if(type === 'resource') iconName = 'book-open';
  
  let badgeLabel = data.category || data.subject || 'General';
  let badgeHtml = \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="tag" class="w-3 h-3"></i> \${badgeLabel}</span>\`;
  
  if (data.schoolId) {
    let sName = (typeof SCHOOL_NAMES !== 'undefined' && SCHOOL_NAMES[data.schoolId]) ? SCHOOL_NAMES[data.schoolId] : data.schoolId;
    badgeHtml = \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="school" class="w-3 h-3"></i> \${sName}</span>\`;
  }
  
  if (data.studentName) {
    badgeHtml = \`<span class="flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full"><i data-lucide="user" class="w-3 h-3"></i> \${data.studentName}</span>\`;
  }

  let url = data.url || data.fileUrl;
  let actionText = type === 'link' ? 'View External Link' : type === 'exam' ? 'Open Exam' : 'Open Resource';
  let actionIcon = type === 'link' ? 'external-link' : type === 'exam' ? 'pencil' : 'paperclip';

  card.innerHTML = \`
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <i data-lucide="\${iconName}" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="font-bold text-lg text-on-surface m-0 leading-tight">\${data.title}</h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
            \${badgeHtml}
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> \${fmt(data.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm text-on-surface-variant leading-relaxed m-0 line-clamp-3">\${data.description || 'No description provided.'}</p>
    <div class="mt-auto pt-4 flex flex-col gap-2 border-t border-outline-variant">
      \${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="\${actionIcon}" class="w-4 h-4"></i> \${actionText}</a>\` : ''}
      <div class="flex justify-end mt-2">
        <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-error/10 text-error hover:bg-error hover:text-white transition-colors" onclick="deleteRes('\${data.id}', '\${data.colName}')">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
        </button>
      </div>
    </div>
  \`;
  setTimeout(() => lucide.createIcons({ root: card }), 0);
  return card;
}`);

// Now replace usages of makeCard:
code = code.replace(/grid\.appendChild\(makeCard\(\`[\s\S]*?<div class="card-meta">\$\{fmt\(data\.timestamp\)\}<\/div>\n\s*\`\)\);/g, function(match, offset, string) {
    if (match.includes('📝 Open Exam') && match.includes('pill-gold')) {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'schoolExams'}, 'exam'));";
    } else if (match.includes('📝 Open Exam')) {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'exams'}, 'exam'));";
    } else if (match.includes('Open Link') && !match.includes('pill-gold')) {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'links'}, 'link'));";
    } else {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'resources'}, 'resource'));";
    }
});

// For loadSchoolResources
code = code.replace(/grid\.appendChild\(makeCard\(\`[\s\S]*?<div class="card-meta">\$\{fmt\(item\.timestamp\)\}<\/div>\n\s*\`\)\);/g, function(match) {
    return "grid.appendChild(makeCard({...item, id: item.id, colName: item.col}, item.type));";
});

// For loadStudentResources
code = code.replace(/grid\.appendChild\(makeCard\(\`[\s\S]*?<div class="card-meta">\$\{fmt\(item\.timestamp\)\}<\/div>\n\s*\`\)\);/g, function(match) {
    return "grid.appendChild(makeCard({...item, studentName, id: item.id, colName: item.colName}, item.type));";
});

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', code);
