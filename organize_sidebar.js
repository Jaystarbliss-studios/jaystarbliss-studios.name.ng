const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Move Programme Approvals to Requests section
const progApprHtml = `<button class="nav-item " data-tab="programmeApprovals" onclick="window.switchTab('programmeApprovals')">
    <span class="material-symbols-outlined">fact_check</span> Programme Approvals
</button>`;

if(html.includes(progApprHtml)) {
    html = html.replace(progApprHtml, ''); // remove from top
    html = html.replace(/(<div class="sidebar-label">Requests<\/div>)/, `$1\n${progApprHtml}`); // add after Requests label
    
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
    console.log("Organized sidebar");
}
