const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

if (!content.includes('href="/favicon.ico"')) {
    content = content.replace('<link rel="icon" type="image/png" href="/favicon.png" />', 
        '<link rel="icon" type="image/x-icon" href="/favicon.ico" />\n    <link rel="icon" type="image/png" href="/favicon.png" />');
    fs.writeFileSync('index.html', content);
    console.log('index.html updated with favicon.ico link');
} else {
    console.log('favicon.ico already linked');
}
