const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// For loadSchoolExams
code = code.replace(
/async function loadSchoolExams\(\) \{([\s\S]*?)var iconName = item\.type === 'link' \? 'link' : 'file-text';([\s\S]*?)deleteSchoolResource\('\$\{item\.id\}', '\$\{item\.col\}'\)([\s\S]*?)loadSchoolExams\(\);/m,
`async function loadSchoolExams() {$1var iconName = 'file-question';
      var badgeColor = 'bg-error-container text-on-error-container';
      var url = data.url || data.fileUrl || '';
      var itemId = docSnap.id;$2deleteSchoolExam('\${itemId}')$3loadSchoolExams();`
);

// For loadNewsCorner
code = code.replace(
/async function loadNewsCorner\(\) \{([\s\S]*?)var iconName = item\.type === 'link' \? 'link' : 'file-text';([\s\S]*?)\$\{url \? \`\<a href="\$\{url\}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"\>\<i data-lucide="\$\{item\.type === 'link' \? 'external-link' : 'paperclip'\}" class="w-4 h-4"\>\<\/i\> \$\{item\.type === 'link' \? 'View External Link' : 'Open Attached File'\}\<\/a\>\` : ''\}([\s\S]*?)deleteSchoolResource\('\$\{item\.id\}', '\$\{item\.col\}'\)([\s\S]*?)loadNewsCorner\(\);/m,
`async function loadNewsCorner() {$1var iconName = 'newspaper';
      var badgeColor = 'bg-secondary-container text-on-secondary-container';
      var url = data.imageUrl || '';
      var itemId = docSnap.id;$2\${url ? \`<a href="\${url}" target="_blank" class="flex items-center gap-2 text-sm text-primary font-medium hover:underline w-fit"><i data-lucide="image" class="w-4 h-4"></i> View Image</a>\` : ''}$3deleteNewsPost('\${itemId}')$4loadNewsCorner();`
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
