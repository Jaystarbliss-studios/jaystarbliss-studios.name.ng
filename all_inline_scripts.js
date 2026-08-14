
        function toggleSidebar() {
            const sidebar = document.getElementById('appSidebar');
            const overlay = document.getElementById('mobileOverlay');
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
        
        document.querySelectorAll('.sidebar-menu .nav-item').forEach(a => {
            a.addEventListener('click', () => {
                if(window.innerWidth < 768) toggleSidebar();
            });
        });

        // Patch switchTab if it doesn't handle our new active classes correctly
        const originalSwitchTab = window.switchTab;
        window.switchTab = function(name) {
            if(originalSwitchTab) {
                try { originalSwitchTab(name); } catch(e){}
            }
            // Fallback forced switch
            document.querySelectorAll('.sidebar-menu .nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.tab-pane, .tab-content').forEach(p => p.classList.remove('active'));
            
            const btn = document.querySelector('.sidebar-menu .nav-item[data-tab="' + name + '"]');
            if(btn) btn.classList.add('active');
            
            const pane = document.getElementById('tab-' + name) || document.getElementById(name);
            if(pane) pane.classList.add('active');
            document.querySelector('main')?.scrollTo(0, 0);
        };

        setTimeout(() => {
            const nameSrc = document.getElementById('navNameFallback');
            if(nameSrc && nameSrc.innerText && nameSrc.innerText !== 'Loading...') {
                const initials = nameSrc.innerText.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
                const navInitials = document.getElementById('topNavInitials');
                if(navInitials) navInitials.innerText = initials;
            }
        }, 1500);
    
    (function(){ const s=localStorage.getItem('jdh-theme')||'dark'; document.documentElement.setAttribute('data-theme',s); })();
    window.toggleTheme=function(){const h=document.documentElement,n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);localStorage.setItem('jdh-theme',n);};
    function closeSidebar() { const sb = document.getElementById('appSidebar'); const ov = document.getElementById('mobileOverlay'); if(sb) sb.classList.add('-translate-x-full'); if(ov) ov.classList.add('hidden'); }
    window.closeSidebar=closeSidebar;
    function closeNotif(){document.getElementById('notifPanel').classList.remove('open');document.getElementById('notifOverlay').classList.remove('open');}
    window.closeNotif=closeNotif;
    window.switchTab=function(name){
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.target===name));
        document.querySelectorAll('.sidebar-menu .nav-item').forEach(n=>n.classList.toggle('active',n.dataset.tab===name));
        document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active',p.id==='tab-'+name));
        const tmp_breadcrumbActive = document.getElementById('breadcrumbActive'); if(tmp_breadcrumbActive) tmp_breadcrumbActive.textContent = name.charAt(0).toUpperCase()+name.slice(1);
        if(window.innerWidth<=1024)closeSidebar();
        document.querySelector('main')?.scrollTo(0,0);
    };
    document.addEventListener('DOMContentLoaded',function(){
        document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>window.switchTab(b.dataset.target)));
        document.querySelectorAll('.sidebar-menu .nav-item').forEach(n=>n.addEventListener('click',e=>{e.preventDefault();window.switchTab(n.dataset.tab);}));
        document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>window.switchTab(b.dataset.goto)));
        const hb=document.getElementById('hamburgerBtn');
        hb?.addEventListener('click', () => { if(window.toggleSidebar) window.toggleSidebar(); });
        document.getElementById('notifToggleBtn').addEventListener('click',function(){document.getElementById('notifPanel').classList.toggle('open');document.getElementById('notifOverlay').classList.toggle('open');});
        document.getElementById('notifCloseBtn').addEventListener('click',closeNotif);
        document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNotif();closeSidebar();}});
    });

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
document.addEventListener("DOMContentLoaded", function() { lucide.createIcons(); });