const fs = require('fs');
const acorn = require('acorn');
const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/g;
let match;
let hasError = false;
while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    if (scriptContent.trim()) {
        try {
            acorn.parse(scriptContent, { ecmaVersion: 2022, sourceType: 'module' });
        } catch (e) {
            console.error(`Syntax error in script starting at offset ${match.index}:`, e.message);
            hasError = true;
            console.error(scriptContent.substring(Math.max(0, e.pos - 50), e.pos + 50));
        }
    }
}
if (!hasError) console.log("All scripts passed syntax check.");
