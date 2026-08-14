
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
    