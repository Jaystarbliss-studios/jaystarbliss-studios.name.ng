const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

if(!code.includes('data-tab="schedule"')) {
    const navItem = `<a class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg mb-xs font-label-lg text-label-lg cursor-pointer" data-tab="schedule" onclick="window.switchTab('schedule')">
    <span class="material-symbols-outlined">calendar_month</span> Session Calendar
</a>`;
    code = code.replace(/<a[^>]+data-tab="progress"[^>]+>[\s\S]*?<\/a>/, `$&` + '\n' + navItem);
    
    // Add tab pane
    const tabPane = `<div class="tab-pane" id="tab-schedule">
    <div class="panel">
        <div class="panel-head"><div class="panel-title">Session Calendar</div></div>
        <div class="panel-body">
            <div id="countdownTimer" style="margin-bottom:20px; padding:15px; background:var(--brand-secondary-light); border-radius:8px; text-align:center;">
                <h4 style="margin:0; color:var(--brand-primary);">Next Class In</h4>
                <div id="countdownText" style="font-size:24px; font-weight:bold; font-family:var(--mono);">Loading...</div>
            </div>
            <div id="calendarContainer" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
                <div class="req-empty">Loading calendar...</div>
            </div>
        </div>
    </div>
</div>`;
    code = code.replace(/<div class="tab-pane" id="tab-progress">/, tabPane + '\n$&');
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', code);
    console.log("Patched parent portal HTML for Phase B");
}
