const fs = require('fs');

function fixLayoutLogo(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add import if not present
  if (!content.includes('import jaystarblissLogo from')) {
    content = `import jaystarblissLogo from '../../assets/jaystarbliss-logo.png';\n` + content;
  }
  
  // Replace string paths
  content = content.replace(/src="\/favicon\.svg"/g, 'src={jaystarblissLogo}');
  
  fs.writeFileSync(filePath, content);
  console.log("Fixed", filePath);
}

fixLayoutLogo('src/components/layout/Navbar.tsx');
fixLayoutLogo('src/components/admin/AdminLayout.tsx');
fixLayoutLogo('src/components/portal/PortalLayout.tsx');

let globe = fs.readFileSync('src/components/home/LogoGlobe.tsx', 'utf8');
if (!globe.includes('import jaystarblissLogo from')) {
  globe = `import jaystarblissLogo from '../../assets/jaystarbliss-logo.png';\n` + globe;
}
globe = globe.replace(/\/favicon\.svg/g, 'jaystarblissLogo');
// The loader expects a string variable here, so if it was `loader.load('/favicon.svg',` it becomes `loader.load(jaystarblissLogo,`
// Let's make sure it doesn't have quotes around jaystarblissLogo
globe = globe.replace(/'jaystarblissLogo'/g, 'jaystarblissLogo');
globe = globe.replace(/"jaystarblissLogo"/g, 'jaystarblissLogo');

fs.writeFileSync('src/components/home/LogoGlobe.tsx', globe);
console.log("Fixed Globe");
