const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

if(!code.includes('billingCycles')) {
    const navItem = `<button class="nav-item " data-tab="billingCycles" onclick="window.switchTab('billingCycles')">
    <span class="material-symbols-outlined">payments</span> Billing & Cycles
</button>`;
    code = code.replace(/<div class="sidebar-label">System<\/div>/, navItem + '\n$&');
    
    const tabPane = `<div id="billingCycles" class="tab-content">
    <div class="panel">
        <div class="panel-head"><div class="panel-title"><span class="material-symbols-outlined">event_repeat</span> Manage Cycles</div></div>
        <div class="panel-body">
            <button class="btn btn-primary" style="margin-bottom:15px;" onclick="window.openCycleModal()">Create New Cycle</button>
            <table id="cyclesTable">
                <thead><tr><th>Student</th><th>Tutor</th><th>Subject</th><th>Freq</th><th>Start Date</th><th>Status</th></tr></thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>`;
    code = code.replace(/<div id="notifications" class="tab-content">/, tabPane + '\n$&');
    
    const importCode = `
import { initPhaseBAdmin } from '../../assets/js/phase_b_admin.js';
initPhaseBAdmin(db);
`;
    code = code.replace(/const db\s*=\s*getFirestore\(app\);/g, "$&\n" + importCode);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', code);
    console.log("Injected Phase B Admin logic.");
}
