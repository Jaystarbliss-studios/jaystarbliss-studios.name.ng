const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

code = code.replace(/<h3>📚 Christy Caleb International School<\/h3>/g, `<h3><i data-lucide="school" class="w-5 h-5 inline align-text-bottom mr-1 text-primary"></i> Christy Caleb International School</h3>`);
code = code.replace(/<strong>🔑 Access Control:<\/strong>/g, `<strong><i data-lucide="key" class="w-4 h-4 inline align-text-bottom mr-1"></i> Access Control:</strong>`);
code = code.replace(/<div><h3>👤 /g, `<div><h3><i data-lucide="user" class="w-5 h-5 inline align-text-bottom mr-1 text-primary"></i> `);
code = code.replace(/alert\('✅ /g, `alert('Success! `);
code = code.replace(/alert\(\`✅ /g, `alert(\`Success! `);
code = code.replace(/<div class="req-card-name">👤 /g, `<div class="req-card-name"><i data-lucide="user" class="w-4 h-4 inline align-text-bottom mr-1"></i> `);
code = code.replace(/📚 \$\{Array/g, `<i data-lucide="book-open" class="w-4 h-4 inline align-text-bottom mr-1 text-on-surface-variant"></i> \${Array`);
code = code.replace(/<div class="req-card-meta">✅ Linked Student ID/g, `<div class="req-card-meta"><i data-lucide="check-circle" class="w-4 h-4 inline align-text-bottom mr-1 text-secondary"></i> Linked Student ID`);

code = code.replace(/const ICONS = \{ login:'🔓', logout:'🔒', staff_resource_sent:'📤', staff_school_resource_sent:'🏫', student_added:'👤' \};/g, `const ICONS = { login:'<i data-lucide="log-in" class="w-4 h-4 inline"></i>', logout:'<i data-lucide="log-out" class="w-4 h-4 inline"></i>', staff_resource_sent:'<i data-lucide="send" class="w-4 h-4 inline"></i>', staff_school_resource_sent:'<i data-lucide="school" class="w-4 h-4 inline"></i>', student_added:'<i data-lucide="user-plus" class="w-4 h-4 inline"></i>' };`);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
