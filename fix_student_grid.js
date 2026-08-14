const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Update the container
html = html.replace(
  /<div id="studentsListContainer" style="display:grid;gap:\.55rem;">/,
  '<div id="studentsListContainer" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">'
);

// Update the card creation to remove mb-3 as we're using a grid gap
html = html.replace(
  /card\.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative mb-3';/,
  "card.className = 'bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col gap-3 shadow-sm relative h-full';"
);

// Update the label for the input
html = html.replace(
  /<label class="text-xs font-bold text-on-surface-variant">Update Access Code<\/label>/g,
  '<label class="text-xs font-bold text-on-surface-variant">Update Password (Access Code)</label>'
);
html = html.replace(
  /placeholder="New access code"/g,
  'placeholder="New password"'
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Fixed student list grid and labels");
