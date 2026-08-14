const fs = require('fs');
const path = '/app/applet/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('AdminApprovals')) {
  // Add import
  const importStatement = "import AdminApprovals from './pages/admin/AdminApprovals';\n";
  content = content.replace("import AdminDashboard from './pages/admin/AdminDashboard';", importStatement + "import AdminDashboard from './pages/admin/AdminDashboard';");

  // Add route
  const routeStatement = "          <Route path=\"approvals\" element={<AdminApprovals />} />\n";
  content = content.replace("<Route index element={<AdminDashboard />} />", "<Route index element={<AdminDashboard />} />\n" + routeStatement);

  fs.writeFileSync(path, content, 'utf8');
  console.log('Updated App.tsx routes');
} else {
  console.log('Routes already present in App.tsx');
}
