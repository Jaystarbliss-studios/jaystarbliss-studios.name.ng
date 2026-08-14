const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

// Add Progress & Performance tab link
if(!code.includes('data-tab="progress"')) {
    const navItem = `<a class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg mb-xs font-label-lg text-label-lg cursor-pointer" data-tab="progress" onclick="window.switchTab('progress')">
    <span class="material-symbols-outlined">analytics</span> Progress &amp; Performance
</a>`;
    code = code.replace(/<a[^>]+data-tab="children"[^>]+>[\s\S]*?<\/a>/, `$&` + '\n' + navItem);
    
    // Add tab pane
    const tabPane = `<div class="tab-pane" id="tab-progress">
    <div class="panel">
        <div class="panel-head"><div class="panel-title">Progress &amp; Performance</div></div>
        <div class="panel-body" id="progressContainer">
            <div class="req-empty">Loading progress...</div>
        </div>
    </div>
</div>`;
    code = code.replace(/<div class="tab-pane" id="tab-children">/, tabPane + '\n$&');
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', code);
    console.log("Patched parent portal HTML");
}
