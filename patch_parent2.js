const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

if(!code.includes('chart.umd.min.js')) {
    code = code.replace(/<\/head>/, `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>\n</head>`);
}

if(!code.includes('phase_a_parent.js')) {
    const importCode = `
import { loadParentProgress } from '../../assets/js/phase_a_parent.js';
// Wait, we need to call loadParentProgress when a child is selected.
// I will hook into viewChildDetails
window._originalViewChildDetails = window.viewChildDetails;
window.viewChildDetails = function(childId) {
    if(window._originalViewChildDetails) window._originalViewChildDetails(childId);
    loadParentProgress(db, childId);
};
`;
    code = code.replace(/const db\s*=\s*getFirestore\(app\);/g, "$&\n" + importCode);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', code);
    console.log("Injected Phase A Parent logic.");
}
