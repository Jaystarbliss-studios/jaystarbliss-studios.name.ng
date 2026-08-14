const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Add Programme Approvals tab link
if(!code.includes('data-tab="programmeApprovals"')) {
    const navItem = `<button class="nav-item " data-tab="programmeApprovals" onclick="window.switchTab('programmeApprovals')">
    <span class="material-symbols-outlined">fact_check</span> Programme Approvals
</button>`;
    code = code.replace(/<div class="sidebar-label">Command Modules<\/div>/, navItem + '\n$&');
    
    // Add tab pane
    const tabPane = `<div class="tab-pane" id="programmeApprovals">
    <div class="panel">
        <div class="panel-head"><div class="panel-title">Programme Approvals</div></div>
        <div class="panel-body">
            <table id="approvalsTable">
                <thead><tr><th>Student</th><th>Tutor</th><th>Programme</th><th>Date</th><th>Action</th></tr></thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>`;
    code = code.replace(/<div class="tab-content" id="dashboard">/, tabPane + '\n$&');
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
    console.log("Patched admin portal HTML");
}
