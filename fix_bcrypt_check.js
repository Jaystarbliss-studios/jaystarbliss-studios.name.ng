const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const target = `    if (data.accessCodeHash) {
      isValid = bcrypt.compareSync(accessCode.trim(), data.accessCodeHash);
    } else {
      isValid = bcrypt.compareSync(accessCode.trim(), data.accessCode);
      if (accessCode.trim() === data.accessCode) isValid = true;
    }`;

const replacement = `    if (data.accessCodeHash) {
      try {
        isValid = bcrypt.compareSync(accessCode.trim(), data.accessCodeHash);
      } catch(e) { console.error('Bcrypt error', e); }
    } else {
      if (accessCode.trim() === data.accessCode) isValid = true;
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
console.log("Fixed bcrypt check logic");
