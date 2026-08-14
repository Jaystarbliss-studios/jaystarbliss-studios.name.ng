const fs = require('fs');
['staff-portal.html', 'student-portal.html'].forEach(file => {
  let path = 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/' + file;
  let code = fs.readFileSync(path, 'utf8');
  if (!code.includes('lucide@latest')) {
     code = code.replace(/<link href="https:\/\/fonts.googleapis.com\/css2\?family=Material\+Symbols\+Outlined[^>]+>/, '$&\n<script src="https://unpkg.com/lucide@latest"></script>');
     fs.writeFileSync(path, code);
  }
});
