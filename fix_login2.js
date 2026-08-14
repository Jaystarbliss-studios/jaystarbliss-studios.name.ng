const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const regexOuter = /    console\.log\("Querying for email:", emailNorm\);([\s\S]*?)    try \{\n\s*const resetLimit = httpsCallable\(functions, 'resetLoginRateLimit'\);/m;

const replacementOuter = `    try {
      const verifyAccessCode = httpsCallable(functions, 'verifyAccessCode');
      const result = await verifyAccessCode({ username: email, accessCode: accessCode });
      if (result.data && result.data.success) {
        // We got a custom token! Sign in!
        const { signInWithCustomToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await signInWithCustomToken(auth, result.data.token);
        
        try {
          const resetLimit = httpsCallable(functions, 'resetLoginRateLimit');
          await resetLimit({ email: emailNorm });
        } catch(e) {}
        
        return { id: result.data.studentId, ...result.data.data };
      } else if (result.data && result.data.success === false) {
        try {
          const recordFailed = httpsCallable(functions, 'recordFailedLogin');
          await recordFailed({ email: emailNorm });
        } catch(e) {}
        return null;
      }
    } catch(err) {
      console.warn("verifyAccessCode cloud function failed/missing. Falling back to client query...", err);
    }
    
    // Fallback if cloud function not deployed
    console.log("Querying for email:", emailNorm);
    let snap = await getDocs(query(collection(db, 'students'), where('email', '==', emailNorm)));
    if (snap.empty) {
      console.log("Trying exact username:", email.trim());
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', email.trim())));
    }
    if (snap.empty) {
      console.log("Trying lowercase username:", emailNorm);
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', emailNorm)));
    }
    if (snap.empty) {
      console.log("Trying uppercase username:", email.trim().toUpperCase());
      snap = await getDocs(query(collection(db, 'students'), where('username', '==', email.trim().toUpperCase())));
    }
    
    if (snap.empty) {
      try {
        const recordFailed = httpsCallable(functions, 'recordFailedLogin');
        await recordFailed({ email: emailNorm });
      } catch(err) { console.warn('recordFailedLogin failed'); }
      return null;
    }
    
    const d = snap.docs[0];
    const data = d.data();
    
    if (data.accessCodeExpiry) {
      const now = new Date();
      const expiry = data.accessCodeExpiry.toDate ? data.accessCodeExpiry.toDate() : new Date(data.accessCodeExpiry);
      if (now > expiry) {
        console.error('[JDH] Access code expired');
        return { error: 'Access code expired' };
      }
    }
    
    let isValid = false;
    if (data.accessCodeHash) {
      try {
        isValid = bcrypt.compareSync(accessCode.trim(), data.accessCodeHash);
      } catch(e) { console.error('Bcrypt error', e); }
    }
    if (!isValid && data.accessCode) {
      if (accessCode.trim() === data.accessCode) isValid = true;
    }
    
    if (!isValid) {
      try {
        const recordFailed = httpsCallable(functions, 'recordFailedLogin');
        await recordFailed({ email: emailNorm });
      } catch(err) {}
      return null;
    }
    
    try {
      const resetLimit = httpsCallable(functions, 'resetLoginRateLimit');`;

code = code.replace(regexOuter, replacementOuter);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
console.log("Replaced logic with Cloud Function priority");
