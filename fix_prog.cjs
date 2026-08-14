const fs = require('fs');
let text = fs.readFileSync('src/pages/ProgramDetails.tsx', 'utf8');
text = text.replace("{program.categoryId || 'General'}", "{program.categoryId ? program.categoryId.replace(/_/g, ' ') : 'General'}");
fs.writeFileSync('src/pages/ProgramDetails.tsx', text);
