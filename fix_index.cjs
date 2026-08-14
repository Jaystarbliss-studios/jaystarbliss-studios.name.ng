const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<link rel="apple-touch-icon" href="\/favicon.png" \/>/g, '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
html = html.replace(/https:\/\/jaystarbliss-studios.name.ng\/jaystarbliss-logo.png/g, 'https://jaystarbliss-studios.name.ng/favicon.png');

if (!html.includes('android-chrome-192x192.png')) {
    html = html.replace('</title>', '</title>\n    <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />\n    <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />');
}

fs.writeFileSync('index.html', html);
console.log('Fixed index.html');
