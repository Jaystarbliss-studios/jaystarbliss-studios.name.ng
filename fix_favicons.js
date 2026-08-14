const fs = require('fs');
const path = require('path');

const faviconTags = `
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/assets/img/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon.png">
    <link rel="apple-touch-icon" href="/assets/img/favicon.ico">
`;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const htdocsPath = path.join(__dirname, 'jaystarbliss-studios.name.ng', 'htdocs');
const htmlFiles = walk(htdocsPath);

let modifiedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // First, remove existing favicon tags to avoid duplicates
    content = content.replace(/<link rel="icon" type="image\/x-icon".*?>\n?/g, '');
    content = content.replace(/<link rel="icon" type="image\/png".*?>\n?/g, '');
    content = content.replace(/<link rel="apple-touch-icon".*?>\n?/g, '');
    // Also remove the specific ones in index.html with href="assets/..."
    content = content.replace(/<link rel="icon".*?>\n?/gi, '');
    content = content.replace(/<link rel="apple-touch-icon".*?>\n?/gi, '');
    content = content.replace(/<link rel="shortcut icon".*?>\n?/gi, '');

    // Inject our standard favicon tags right after <head>
    if (content.includes('<head>')) {
        content = content.replace('<head>', '<head>' + faviconTags);
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}

console.log("Favicons injected into " + modifiedCount + " HTML files.");
