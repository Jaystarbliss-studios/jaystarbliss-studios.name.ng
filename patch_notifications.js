const fs = require('fs');

function patchNotifications(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // Add id to bell and badge
    if(code.includes('<span class="material-symbols-outlined">notifications</span>')) {
        code = code.replace(/<button class="p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant relative"[^>]*>/, '<button id="notifBell" class="p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant relative">');
        code = code.replace(/<span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"><\/span>/, '<span id="notifBadge" class="notif-badge absolute top-1 right-1" style="display:none; font-size:10px; background:#C9A84C; color:white; border-radius:50%; padding:2px 5px;">0</span>');
    }

    // Add slide-out panel HTML right after header or at end of body
    const panelHTML = `
    <!-- Slide-out Notifications Panel -->
    <div id="notifPanel" class="fixed right-0 top-0 h-full w-80 bg-surface-container-lowest shadow-lg transform translate-x-full transition-transform duration-300 z-50 flex flex-col">
        <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 class="font-headline-sm text-on-surface">Notifications</h3>
            <button onclick="document.getElementById('notifPanel').classList.add('translate-x-full'); document.getElementById('notifPanel').classList.remove('active');" class="text-on-surface-variant"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="notifContent" class="flex-grow overflow-y-auto bg-surface p-sm"></div>
    </div>
    <style>
        #notifPanel.active { transform: translateX(0); }
    </style>
    `;
    if(!code.includes('id="notifPanel"')) {
        code = code.replace(/<\/body>/, panelHTML + '\n</body>');
    }

    // Setup JS
    const script = `
    import { setupNotifications } from '../../assets/js/jdh-firebase-modules.js';
    const myUid = localStorage.getItem('userId');
    if(myUid) {
        setupNotifications(myUid, 'notifBell', 'notifBadge', 'notifPanel', 'notifContent');
    }
    `;
    
    // Inject logic if not already
    if(!code.includes('setupNotifications(')) {
        if (code.includes('const db = getFirestore(app);')) {
            code = code.replace(/const db = getFirestore\(app\);/g, "$&\n" + script);
        } else {
            // For tutor portal
            code = code.replace(/<\/script><\/body>/, script + '\n</script></body>');
        }
    }

    fs.writeFileSync(file, code);
    console.log("Patched notifications in " + file);
}

['jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html',
 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
 'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html'
].forEach(patchNotifications);

