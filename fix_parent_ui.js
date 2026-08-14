const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

html = html.replace(
    "const tmp_topbarName = document.getElementById('topbarName'); if(tmp_topbarName) tmp_topbarName.textContent = parentName;",
    "const tmp_topbarName = document.getElementById('topNavNameDisplay'); if(tmp_topbarName) tmp_topbarName.textContent = parentName;\nconst navRoleFallback = document.getElementById('navRoleFallback'); if(navRoleFallback) navRoleFallback.textContent = localStorage.getItem('userEmail') || 'Parent Account';"
);

html = html.replace(
    "const ta = document.getElementById('topbarAvatar'); if(ta) ta.textContent = initials;",
    "const ta = document.getElementById('topNavInitials'); if(ta) ta.textContent = initials;"
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', html);
console.log("Fixed parent portal UI names");
