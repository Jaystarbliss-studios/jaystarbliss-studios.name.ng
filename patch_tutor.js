const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', 'utf8');

// Add "View Details" to the student table
code = code.replace(/<td><button onclick="window\.openChat\('\${d\.id}'\)">Message<\/button><\/td>/g, 
    `<td>
        <button onclick="window.openChat('\${d.id}')">Message</button>
        <button onclick="window.viewStudentDetails('\${d.id}')">View Details</button>
    </td>`);

if(!code.includes('phase_a_tutor.js')) {
    const importCode = `
import '../../assets/js/phase_a_tutor.js';
`;
    code = code.replace(/const db\s*=\s*getFirestore\(app\);/g, "$&\n" + importCode);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', code);
    console.log("Injected Phase A Tutor logic.");
}
