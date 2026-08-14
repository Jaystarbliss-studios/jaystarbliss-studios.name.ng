const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Add .filter-tabs CSS
code = code.replace(
/\.req-empty \{ @apply text-center text-on-surface-variant p-md bg-surface-container-low rounded-lg italic; \}/,
`.req-empty { @apply text-center text-on-surface-variant p-md bg-surface-container-low rounded-lg italic; }
        .filter-tabs { @apply flex items-center gap-2 mt-2 md:mt-0 ml-auto; }
        .filter-tab { @apply px-4 py-2 text-xs font-bold rounded-full border border-outline-variant bg-surface text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer outline-none; }
        .filter-tab.active { @apply bg-primary text-on-primary border-primary; }`
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
