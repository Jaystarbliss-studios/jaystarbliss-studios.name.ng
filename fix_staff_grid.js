const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Update the container
html = html.replace(
  /<div id="staffListContainer"><\/div>/,
  '<div id="staffListContainer" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4"></div>'
);

// Remove mb-3 from staff cards
html = html.replace(
  /card\.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';/g,
  "card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative h-full';"
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed staff list grid");
