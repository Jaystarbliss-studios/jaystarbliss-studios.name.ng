const fs = require('fs');
['admin-dashboard.html', 'staff-portal.html', 'student-portal.html'].forEach(f => {
  let path = 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/' + f;
  let code = fs.readFileSync(path, 'utf8');
  if (!code.includes('DOMContentLoaded", function() { lucide.createIcons(); }')) {
    code = code.replace(/<\/body>/, `<script>document.addEventListener("DOMContentLoaded", function() { lucide.createIcons(); });</script></body>`);
    fs.writeFileSync(path, code);
  }
});
