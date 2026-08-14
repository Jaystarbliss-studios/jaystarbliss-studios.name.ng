const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const regexLimit = /const checkLimit = httpsCallable\(functions, 'checkLoginRateLimit'\);\n\s*const \{ data: limitData \} = await checkLimit\(\{ email: emailNorm \}\);\n\s*if \(\!limitData\.allowed\) \{\n\s*alert\('Too many failed attempts\. Please try again in ' \+ limitData\.minutesRemaining \+ ' minutes\.'\);\n\s*return null;\n\s*\}/m;

const replacementLimit = `let limitData = { allowed: true };
    try {
      const checkLimit = httpsCallable(functions, 'checkLoginRateLimit');
      const limitResult = await checkLimit({ email: emailNorm });
      if (limitResult && limitResult.data) limitData = limitResult.data;
    } catch(err) {
      console.warn('checkLoginRateLimit failed or not deployed, proceeding...', err);
    }
    
    if (!limitData.allowed) {
      alert('Too many failed attempts. Please try again in ' + limitData.minutesRemaining + ' minutes.');
      return null;
    }`;

code = code.replace(regexLimit, replacementLimit);

const regexRecord = /const recordFailed = httpsCallable\(functions, 'recordFailedLogin'\);\n\s*if \(snap\.empty\) \{\n\s*await recordFailed\(\{ email: emailNorm \}\);\n\s*return null;\n\s*\}/m;

const replacementRecord = `if (snap.empty) {
      try {
        const recordFailed = httpsCallable(functions, 'recordFailedLogin');
        await recordFailed({ email: emailNorm });
      } catch(err) { console.warn('recordFailedLogin failed'); }
      return null;
    }`;

code = code.replace(regexRecord, replacementRecord);

const regexReset = /const resetLimit = httpsCallable\(functions, 'resetLoginRateLimit'\);\n\s*await resetLimit\(\{ email: emailNorm \}\);/m;

const replacementReset = `try {
      const resetLimit = httpsCallable(functions, 'resetLoginRateLimit');
      await resetLimit({ email: emailNorm });
    } catch(err) {}`;
code = code.replace(regexReset, replacementReset);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
console.log("Fixed rate limit function calls");
