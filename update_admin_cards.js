const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');
code = code.replace(/<link href="https:\/\/fonts.googleapis.com\/css2\?family=Material\+Symbols\+Outlined[^>]+>/, '$&\n<script src="https://unpkg.com/lucide@latest"></script>');
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
