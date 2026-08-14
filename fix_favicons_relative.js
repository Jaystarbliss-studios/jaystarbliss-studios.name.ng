const fs = require('fs');
const path = require('path');

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
    
    // Remove the previously injected absolute favicons
    content = content.replace(/<link rel="icon" type="image\/x-icon".*?>\n?/g, '');
    content = content.replace(/<link rel="icon" type="image\/png".*?>\n?/g, '');
    content = content.replace(/<link rel="apple-touch-icon".*?>\n?/g, '');
    content = content.replace(/<!-- Favicons -->\n?/g, '');

    // Calculate relative path to htdocs/assets/img
    const fileDir = path.dirname(file);
    let relativePathToHtdocs = path.relative(fileDir, htdocsPath);
    if (relativePathToHtdocs === '') {
        relativePathToHtdocs = '.';
    }
    const faviconPath = relativePathToHtdocs + '/assets/img';
    
    // Normalize path separators to forward slashes for URLs
    const normalizedFaviconPath = faviconPath.replace(/\\/g, '/');

    const faviconTags = `
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="${normalizedFaviconPath}/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="${normalizedFaviconPath}/favicon.png">
    <link rel="apple-touch-icon" href="${normalizedFaviconPath}/favicon.ico">
`;

    if (content.includes('<head>')) {
        content = content.replace('<head>', '<head>' + faviconTags);
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}

console.log("Relative favicons injected into " + modifiedCount + " HTML files.");
