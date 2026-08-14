const fs = require('fs');
const glob = require('glob');

const script = `
<script>
window.switchTab = function(name, btn) {
    console.log("Switching to tab:", name);
    document.querySelectorAll('.sidebar-menu .nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.tab-pane, .tab-content').forEach(p => p.classList.remove('active'));
    
    let targetBtn = btn || document.querySelector('.sidebar-menu .nav-item[data-tab="' + name + '"]');
    if(targetBtn) targetBtn.classList.add('active');
    
    // Some buttons might pass data-tab="null" but pass 'name' as first argument.
    // We try to find the button by onclick if we couldn't find it
    if(!targetBtn) {
        let allBtns = document.querySelectorAll('.sidebar-menu .nav-item');
        for(let i=0; i<allBtns.length; i++) {
            let attr = allBtns[i].getAttribute('onclick') || '';
            if(attr.includes("'" + name + "'")) {
                allBtns[i].classList.add('active');
                break;
            }
        }
    }
    
    const pane = document.getElementById(name);
    if(pane) pane.classList.add('active');
    
    document.querySelector('main')?.scrollTo(0, 0);
};
window.toggleSidebar = function() {
    const sb = document.getElementById('sidebar');
    if(sb) sb.classList.toggle('-translate-x-full');
};
</script>
`;

const files = glob.sync('jaystarbliss-studios.name.ng/htdocs/pages/**/*.html');
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove my previous patch if any
    content = content.replace(/const originalSwitchTab = window\.switchTab;[\s\S]*?if\(btn\) btn\.classList\.add\('active'\);[\s\S]*?const pane = document\.getElementById\(name\);[\s\S]*?if\(pane\) pane\.classList\.add\('active'\);[\s\S]*?document\.querySelector\('main'\)\?\.scrollTo\(0, 0\);[\s\S]*?\};/, '');
    
    // Make sure we only add it once
    if (!content.includes('window.switchTab = function(name, btn)')) {
        content = content.replace('</body>', script + '\n</body>');
        fs.writeFileSync(file, content);
        console.log("Patched tabs in", file);
    }
}
