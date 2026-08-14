const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<link rel="icon" type="image/png" href="/favicon.png" />', 
  '<link rel="icon" type="image/x-icon" href="/favicon.ico" />\n    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />\n    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />\n    <link rel="apple-touch-icon" href="/favicon.png" />');

if (!html.includes('DM+Serif+Display')) {
  html = html.replace('</head>', '    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n  </head>');
}

fs.writeFileSync('index.html', html);
console.log('Updated index.html');
