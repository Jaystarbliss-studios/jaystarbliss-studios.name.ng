const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const files = {
  'Admin': 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
  'Student': 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
  'Staff': 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
};

for (const [name, file] of Object.entries(files)) {
  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  console.log(`\n\n=== ${name} DASHBOARD ===`);
  document.querySelectorAll('.nav-item, .sidebar a, nav a, .menu a, .tab-btn').forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    if(text) console.log(`Nav/Tab: ${text}`);
  });
}
