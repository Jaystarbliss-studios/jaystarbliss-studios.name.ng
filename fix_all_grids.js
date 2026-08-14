const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Update containers
html = html.replace(
  /<div id="studentRequestsList">/,
  '<div id="studentRequestsList" class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">'
);
html = html.replace(
  /<div id="tutorApplicationsList">/,
  '<div id="tutorApplicationsList" class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">'
);
html = html.replace(
  /<div id="enrollmentRequestsList">/,
  '<div id="enrollmentRequestsList" class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">'
);

// Remove mb-4 from these cards
html = html.replace(
  /card\.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm relative mb-4';/g,
  "card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm relative h-full';"
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed request grids");
