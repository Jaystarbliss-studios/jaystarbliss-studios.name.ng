const fs = require('fs');
const file = 'src/pages/Register.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{ id: 'staff', label: 'STAFF', icon: <User size={18} /> },",
  "{ id: 'staff', label: 'STAFF / TUTOR', icon: <User size={18} /> },"
);
content = content.replace(
  "Create <span className=\"text-[#f05637]\">Node</span>",
  "Create <span className=\"text-[#f05637]\">{activeTab === 'staff' ? 'Staff/Tutor' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span> Account"
);

fs.writeFileSync(file, content);
console.log("Updated tutor references.");
