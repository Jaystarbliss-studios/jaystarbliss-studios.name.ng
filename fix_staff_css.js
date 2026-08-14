const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

const newCSS = `
        .resource-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-md; }
        .resource-card { @apply bg-surface-container p-md rounded-xl border border-outline-variant flex flex-col gap-sm; }
        .resource-card h3 { @apply font-title-md text-title-md font-bold text-on-surface m-0; }
        .resource-card p { @apply text-body-sm text-on-surface-variant m-0; }
        .resource-card .meta { @apply flex items-center gap-sm text-label-sm text-on-surface-variant bg-surface-container-low py-xs px-sm rounded-md w-fit; }
        .resource-card .actions { @apply mt-auto pt-sm flex justify-end gap-sm border-t border-outline-variant; }
        .person-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-md; }
        .person-card { @apply bg-surface-container p-md rounded-xl border border-outline-variant flex flex-col gap-sm; }
    }
</style>`;

html = html.replace(/\.empty-state \{[^\}]+\}\s*\}\s*<\/style>/, `.empty-state { @apply text-center p-xl text-on-surface-variant bg-surface-container-low rounded-xl italic; }` + newCSS);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', html);
console.log("Fixed staff css");
