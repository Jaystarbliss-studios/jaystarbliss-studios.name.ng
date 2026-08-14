const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminProgramForm.tsx', 'utf8');
content = content.replace(
  'deliveryFormat: \'ONLINE\',',
  "deliveryFormat: 'ONLINE',\n    targetAudience: '',"
);
fs.writeFileSync('src/pages/admin/AdminProgramForm.tsx', content);
