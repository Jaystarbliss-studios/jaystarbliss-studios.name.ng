const fs = require('fs');
let lines = fs.readFileSync('src/components/Hero.tsx', 'utf8').split('\n');
// Line 45 is the extra div. Array is 0-indexed, so index 44.
lines.splice(44, 1);
fs.writeFileSync('src/components/Hero.tsx', lines.join('\n'));
