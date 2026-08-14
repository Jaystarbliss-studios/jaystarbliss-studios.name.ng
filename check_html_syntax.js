const fs = require('fs');
const acorn = require('acorn');

const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    let content = match[1].trim();
    if (content) {
        try {
            acorn.parse(content, { ecmaVersion: 2022, sourceType: 'module' });
        } catch (e) {
            console.log('Syntax error in script ' + count + ': ' + e.message);
            let lines = content.split('\n');
            let start = Math.max(0, e.loc.line - 5);
            let end = Math.min(lines.length, e.loc.line + 5);
            console.log(lines.slice(start, end).join('\n'));
        }
    }
    count++;
}
