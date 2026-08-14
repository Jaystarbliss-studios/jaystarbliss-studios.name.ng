const fs = require('fs');
const glob = require('glob');

const inactivityScript = `
<script>
  // Session Timeout Logic (2 hours)
  (function() {
    let inactivityTimer;
    const timeoutDuration = 2 * 60 * 60 * 1000; // 2 hours
    
    function resetTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutDueToInactivity, timeoutDuration);
    }
    
    function logoutDueToInactivity() {
      localStorage.clear();
      alert('Your session has expired due to inactivity. Please log in again.');
      window.location.href = '../auth/login.html';
    }
    
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    
    resetTimer(); // Initialize
    
    window.globalPerformLogout = async function() {
        if (typeof window._doLogout === 'function') { await window._doLogout(); return; }
        if (typeof window.doLogout === 'function') { await window.doLogout(); return; }
        
        try {
           const { getAuth, signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
           await signOut(getAuth());
        } catch (e) {}
        
        localStorage.clear();
        window.location.href = '../auth/login.html';
    };
  })();
</script>
</head>
`;

const files = glob.sync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/*.html');

for (const file of files) {
    if (file.includes('checkout')) continue; // Skip dummy pages if any
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace </head> with the inactivity script
    if (!html.includes('globalPerformLogout')) {
        html = html.replace('</head>', inactivityScript);
    }
    
    // Fix logout buttons
    html = html.replace(/onclick="window\.doLogout \? [^"]+"/g, 'onclick="window.globalPerformLogout()"');
    html = html.replace(/onclick="document\.getElementById\('logoutBtn'\)\?\.click\(\)"/g, 'onclick="window.globalPerformLogout()"');
    html = html.replace(/onclick="document\.getElementById\('logoutBtn'\)\.click\(\)"/g, 'onclick="window.globalPerformLogout()"');
    
    fs.writeFileSync(file, html);
    console.log("Processed", file);
}
