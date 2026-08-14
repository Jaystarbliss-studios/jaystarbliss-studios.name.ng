const fs = require('fs');
const path = '/app/applet/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('StaffDashboard')) {
  // Add import
  const importStatement = "import StaffDashboard from './pages/portal/StaffDashboard';\n";
  content = content.replace("import StudentDashboard from './pages/portal/StudentDashboard';", importStatement + "import StudentDashboard from './pages/portal/StudentDashboard';");

  // Update route
  const oldRoute = "<Route index element={<div className=\"p-8 text-center text-gray-500\">Staff Dashboard coming soon</div>} />";
  const newRoute = "<Route index element={<StaffDashboard />} />";
  content = content.replace(oldRoute, newRoute);

  fs.writeFileSync(path, content, 'utf8');
  console.log('Updated App.tsx with StaffDashboard routes');
} else {
  console.log('StaffDashboard routes already present in App.tsx');
}
