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
    
    // Find all imports that are not at the top of the <script type="module">
    const scriptTag = '<script type="module">';
    let parts = html.split(scriptTag);
    if(parts.length > 1) {
        for(let i=1; i<parts.length; i++) {
            let scriptContent = parts[i];
            let endIdx = scriptContent.indexOf('</script>');
            if(endIdx > -1) {
                let inside = scriptContent.substring(0, endIdx);
                // Extract all imports (with possible leading whitespace)
                let importRegex = /^\s*import\s+[\s\S]*?from\s+['"].*?['"];?$/gm;
                let imports = [];
                let match;
                while((match = importRegex.exec(inside)) !== null) {
                    // avoid picking up imports inside multiline comments if any, but this is simple enough
                    imports.push(match[0].trim());
                }
                
                if(imports.length > 0) {
                    // Remove all imports
                    let cleaned = inside.replace(/^\s*import\s+[\s\S]*?from\s+['"].*?['"];?$/gm, '');
                    
                    // Remove duplicate imports
                    imports = [...new Set(imports)];
                    
                    // Prepend all imports
                    let newInside = '\n' + imports.join('\n') + '\n' + cleaned;
                    parts[i] = newInside + scriptContent.substring(endIdx);
                }
            }
        }
        html = parts.join(scriptTag);
        fs.writeFileSync(file, html);
    }
}
console.log("Fixed import order 2");
