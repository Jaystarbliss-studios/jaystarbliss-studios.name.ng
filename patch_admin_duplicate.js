const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// The second script block calls these twice
html = html.replace(/initPhaseBAdmin\(db\);\s*loadProgrammeApprovals\(db\);/g, (match, offset) => {
    // Keep the first one, remove the second one
    if (offset > 50000) { // arbitrary high offset to target the second one
        return '';
    }
    return match;
});

// To be safe, just replace the exact string at the bottom
html = html.replace("const db  = getFirestore(app);\n\ninitPhaseBAdmin(db);\n\n\nloadProgrammeApprovals(db);", "const db  = getFirestore(app);");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Patched duplicate init");
