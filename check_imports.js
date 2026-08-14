const fs = require('fs');
const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html'
];

for(const file of files) {
    if(!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    
    const scriptTag = '<script type="module">';
    let parts = html.split(scriptTag);
    if(parts.length > 1) {
        for(let i=1; i<parts.length; i++) {
            let scriptContent = parts[i];
            let endIdx = scriptContent.indexOf('</script>');
            if(endIdx > -1) {
                let inside = scriptContent.substring(0, endIdx);
                let lines = inside.split('\n');
                let foundNonImport = false;
                for(let j=0; j<lines.length; j++) {
                    let line = lines[j].trim();
                    if(line === '') continue;
                    if(line.startsWith('import ')) {
                        if(foundNonImport) {
                            console.error(file + ": Import not at top level on line " + j + ": " + line);
                        }
                    } else if (!line.startsWith('/*') && !line.startsWith('*') && !line.startsWith('//')) {
                        // Found a real non-import statement
                        foundNonImport = true;
                    }
                }
            }
        }
    }
}
