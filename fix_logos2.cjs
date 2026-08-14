const fs = require('fs');

function fixLogo(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import logoImage from '../../assets/favicon.png';
  content = content.replace(/import logoImage from '[^']+';\n?/g, '');
  
  // Replace {logoImage} with "/favicon.svg"
  content = content.replace(/src=\{logoImage\}/g, 'src="/favicon.svg"');
  // Also if any still have "/favicon.png", change to "/favicon.svg"
  content = content.replace(/src="\/favicon\.png"/g, 'src="/favicon.svg"');
  
  fs.writeFileSync(filePath, content);
  console.log("Fixed", filePath);
}

fixLogo('src/components/layout/Navbar.tsx');
fixLogo('src/components/admin/AdminLayout.tsx');
fixLogo('src/components/portal/PortalLayout.tsx');
