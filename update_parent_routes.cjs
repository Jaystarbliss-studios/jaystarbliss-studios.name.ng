const fs = require('fs');
const path = '/app/applet/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('ParentDashboard')) {
  // Add import
  const importStatement = "import ParentDashboard from './pages/portal/ParentDashboard';\n";
  content = content.replace("import StaffDashboard from './pages/portal/StaffDashboard';", importStatement + "import StaffDashboard from './pages/portal/StaffDashboard';");

  // Update route
  const oldRoute = "<Route index element={<div className=\"p-8 text-center text-gray-500\">Parent Dashboard coming soon</div>} />";
  const newRoute = "<Route index element={<ParentDashboard />} />";
  content = content.replace(oldRoute, newRoute);

  fs.writeFileSync(path, content, 'utf8');
  console.log('Updated App.tsx with ParentDashboard routes');
} else {
  console.log('ParentDashboard routes already present in App.tsx');
}
