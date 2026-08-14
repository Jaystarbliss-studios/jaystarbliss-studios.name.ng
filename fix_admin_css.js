const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const newCSS = `
        .posts-grid { @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md mt-md; }
        .post-card { @apply bg-surface-container-low p-md rounded-xl border border-outline-variant flex flex-col gap-sm; }
        .post-card h3 { @apply font-title-md text-title-md font-bold text-on-surface m-0; }
        .post-card .post-meta { @apply flex items-center gap-sm text-label-sm text-on-surface-variant bg-surface-container py-xs px-sm rounded-md w-fit; }
        .post-card p { @apply text-body-sm text-on-surface-variant m-0; }
        .post-card a { @apply text-primary font-medium hover:underline; }
        .post-card .post-actions { @apply mt-auto pt-sm flex justify-end border-t border-outline-variant; }
        .req-empty { @apply text-center text-on-surface-variant p-md bg-surface-container-low rounded-lg italic; }
    }
</style>`;

html = html.replace(/\.req-empty \{[^\}]+\}\s*\}\s*<\/style>/, newCSS);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed admin css");
