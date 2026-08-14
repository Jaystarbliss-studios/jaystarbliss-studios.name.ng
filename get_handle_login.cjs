const fs = require('fs');
const content = fs.readFileSync('src/pages/Portal.tsx', 'utf8');
const start = content.indexOf('const handleLogin');
const end = content.indexOf('const handleGoogleLogin');
console.log(content.substring(start, end));
