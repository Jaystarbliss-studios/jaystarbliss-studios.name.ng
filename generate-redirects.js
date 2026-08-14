const fs = require('fs');
const glob = require('glob');

const files = glob.sync('jaystarbliss-studios.name.ng/htdocs/**/*.html');

let toml = `[build]
  base = "jaystarbliss-studios.name.ng"
  publish = "htdocs"

[[redirects]]
  from = "/pages/features/Games-section"
  to = "/pages/features/games.html"
  status = 301
  force = true

[[redirects]]
  from = "/pages/features/Games-section/*"
  to = "/pages/features/games.html"
  status = 301
  force = true

[[redirects]]
  from = "/pages/features/Games-section.html"
  to = "/pages/features/games.html"
  status = 301
  force = true

`;

for (const file of files) {
  const path = file.replace('jaystarbliss-studios.name.ng/htdocs', '');
  if (path === '/index.html' || path.startsWith('/yandex')) continue;
  const pathNoExt = path.replace('.html', '');
  
  toml += `[[redirects]]
  from = "${pathNoExt}"
  to = "${path}"
  status = 301
  force = true

`;
}

toml += `[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

fs.writeFileSync('jaystarbliss-studios.name.ng/netlify.toml', toml);
fs.writeFileSync('netlify.toml', toml);
console.log('Done generating redirects.');
