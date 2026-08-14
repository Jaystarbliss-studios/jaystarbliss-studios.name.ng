
    (function(){ const s=localStorage.getItem('jdh-theme')||'dark'; document.documentElement.setAttribute('data-theme',s); })();
    window.toggleTheme=function(){const h=document.documentElement,n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);localStorage.setItem('jdh-theme',n);};
    function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('mobOverlay').classList.remove('open');const i=document.querySelector('#hamburgerBtn .material-symbols-outlined');if(i)i.textContent='menu';}
    window.closeSidebar=closeSidebar;
    function closeNotif(){document.getElementById('notifPanel').classList.remove('open');document.getElementById('notifOverlay').classList.remove('open');}
    window.closeNotif=closeNotif;
    window.switchTab=function(name){
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.target===name));
        document.querySelectorAll('.nav-item[data-tab]').forEach(n=>n.classList.toggle('active',n.dataset.tab===name));
        document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active',p.id==='tab-'+name));
        document.getElementById('breadcrumbActive').textContent=name.charAt(0).toUpperCase()+name.slice(1);
        if(window.innerWidth<=1024)closeSidebar();
        document.querySelector('.main').scrollTo(0,0);
    };
    document.addEventListener('DOMContentLoaded',function(){
        document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>window.switchTab(b.dataset.target)));
        document.querySelectorAll('.nav-item[data-tab]').forEach(n=>n.addEventListener('click',e=>{e.preventDefault();window.switchTab(n.dataset.tab);}));
        document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>window.switchTab(b.dataset.goto)));
        const hb=document.getElementById('hamburgerBtn');
        hb.addEventListener('click',function(){
            const sb=document.getElementById('sidebar'),ov=document.getElementById('mobOverlay');
            sb.classList.toggle('open');ov.classList.toggle('open');
            hb.querySelector('.material-symbols-outlined').textContent=sb.classList.contains('open')?'close':'menu';
        });
        document.getElementById('notifToggleBtn').addEventListener('click',function(){document.getElementById('notifPanel').classList.toggle('open');document.getElementById('notifOverlay').classList.toggle('open');});
        document.getElementById('notifCloseBtn').addEventListener('click',closeNotif);
        document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNotif();closeSidebar();}});
    });
