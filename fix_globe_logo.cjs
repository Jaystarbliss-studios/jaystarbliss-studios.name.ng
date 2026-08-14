const fs = require('fs');

let content = fs.readFileSync('src/components/home/LogoGlobe.tsx', 'utf8');

// Remove import
content = content.replace(/import logoImage from '[^']+';\n?/g, '');

// Replace logoImage with '/favicon.svg'
content = content.replace(/loader\.load\(\s*logoImage,/g, "loader.load(\n      '/favicon.svg',");

fs.writeFileSync('src/components/home/LogoGlobe.tsx', content);
console.log("Fixed globe");
