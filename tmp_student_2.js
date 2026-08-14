
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
