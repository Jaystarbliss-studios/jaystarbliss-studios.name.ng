const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Replace the line generating the username badge
html = html.replace(
  /<span class="flex items-center gap-1 bg-surface-container py-0\.5 px-2 rounded-full"><i data-lucide="at-sign" class="w-3 h-3"><\/i> \$\{data\.username\}<\/span>/,
  "${data.username ? `<span class=\"flex items-center gap-1 bg-surface-container py-0.5 px-2 rounded-full\"><i data-lucide=\"at-sign\" class=\"w-3 h-3\"></i> ${data.username}</span>` : ''}"
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed undefined username display");
