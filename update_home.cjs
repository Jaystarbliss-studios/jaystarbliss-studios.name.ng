const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/pages/Home.tsx', 'utf8');
content = content.replace("import FeaturedServices from '../components/home/FeaturedServices';", "");
content = content.replace("<FeaturedServices />", "");
fs.writeFileSync('/app/applet/src/pages/Home.tsx', content);
