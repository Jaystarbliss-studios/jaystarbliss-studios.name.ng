const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', 'utf8');

if(!code.includes('notifBell')) {
    code = code.replace(/<div class="header">/, `<div class="header">
    <div style="position:relative; margin-right:20px;">
        <button id="notifBell" style="background:none; color:white; border:none; cursor:pointer;">Notifications <span id="notifBadge" style="display:none; background:#C9A84C; border-radius:50%; padding:2px 6px;">0</span></button>
    </div>`);
    
    const panelHTML = `
    <!-- Slide-out Notifications Panel -->
    <div id="notifPanel" class="active" style="display:none; position:fixed; right:0; top:0; width:300px; height:100%; background:white; z-index:1000; box-shadow:-2px 0 5px rgba(0,0,0,0.2); overflow-y:auto;">
        <div style="padding:15px; border-bottom:1px solid #ccc; display:flex; justify-content:space-between;">
            <h3>Notifications</h3>
            <button onclick="document.getElementById('notifPanel').style.display='none'">Close</button>
        </div>
        <div id="notifContent" style="padding:15px;"></div>
    </div>
    `;
    code = code.replace(/<\/body>/, panelHTML + '\n</body>');
    
    // We already have setupNotifications function logic but we need to import it in tutor portal since it's a module
    // Wait, tutor portal has an import script block. We can inject it.
    const script = `
    import { setupNotifications } from '../../assets/js/jdh-firebase-modules.js';
    const tUid = localStorage.getItem('userId');
    if(tUid) {
        setupNotifications(tUid, 'notifBell', 'notifBadge', 'notifPanel', 'notifContent');
        // Override the slide out logic for simple display
        document.getElementById('notifBell').addEventListener('click', () => {
            document.getElementById('notifPanel').style.display = 'block';
        });
    }
    `;
    code = code.replace(/import '\.\.\/\.\.\/assets\/js\/phase_a_tutor\.js';/g, "$&\n" + script);
    
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', code);
    console.log("Patched notifications in tutor portal.");
}
