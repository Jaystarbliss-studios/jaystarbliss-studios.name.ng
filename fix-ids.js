const fs = require('fs');
let content = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', 'utf8');

let i = 1;
content = content.replace(/id="rememberMe"/g, () => `id="rememberMe-${i++}"`);

i = 1;
content = content.replace(/for="rememberMe"/g, () => `for="rememberMe-${i++}"`);

content = content.replace(/id="rememberMe"/g, 'id="rememberMe"');
content = content.replace(/\[id="rememberMe"\]/g, '[id^="rememberMe-"]');

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/auth/login.html', content);
