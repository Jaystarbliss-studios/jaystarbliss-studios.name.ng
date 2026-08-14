const fs = require('fs');

function fixLogo(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('"/favicon.png"')) {
    // Add import
    if (!content.includes("import logoImage from '")) {
       let depth = filePath.split('/').length - 2; // src/components/layout/Navbar.tsx -> depth 3? 
       // let's just use absolute or relative correctly.
       // src/assets/favicon.png
       let relativePath = '../../assets/favicon.png';
       if (filePath.includes('layout')) relativePath = '../../assets/favicon.png';
       if (filePath.includes('admin') || filePath.includes('portal')) relativePath = '../../assets/favicon.png';
       
       content = `import logoImage from '${relativePath}';\n` + content;
    }
    content = content.replace(/"\/favicon\.png"/g, "{logoImage}");
    fs.writeFileSync(filePath, content);
    console.log("Fixed", filePath);
  }
}

fixLogo('src/components/layout/Navbar.tsx');
fixLogo('src/components/admin/AdminLayout.tsx');
fixLogo('src/components/portal/PortalLayout.tsx');
