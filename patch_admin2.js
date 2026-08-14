const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

if(!code.includes('phase_a_admin.js')) {
    const importCode = `
import { loadProgrammeApprovals } from '../../assets/js/phase_a_admin.js';
loadProgrammeApprovals(db);
`;
    // Find the end of the module script where db is initialized
    code = code.replace(/const db\s*=\s*getFirestore\(app\);/g, "$&\n" + importCode);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
    console.log("Injected Phase A Admin logic.");
}
