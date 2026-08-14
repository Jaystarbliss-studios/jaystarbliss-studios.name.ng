const fs = require('fs');
const path = require('path');
const dir = 'jaystarbliss-studios.name.ng/htdocs/assets/js';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.js')) {
        let p = path.join(dir, file);
        let content = fs.readFileSync(p, 'utf8');
        let newContent = content.replace(/\\`/g, '`');
        if (content !== newContent) {
            fs.writeFileSync(p, newContent);
            console.log('Fixed', p);
        }
    }
});
