const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/components/home/CorePillars.tsx', 'utf8');
content = content.replace("THE JAYSTARBLISS ECOSYSTEM", "OUR ECOSYSTEM");
fs.writeFileSync('/app/applet/src/components/home/CorePillars.tsx', content);
