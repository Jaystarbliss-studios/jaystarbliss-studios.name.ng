
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
    import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

    const firebaseConfig = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

    const app  = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db   = getFirestore(app);

    const getInitials = n => n.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    const fmtDate = ts => { if(!ts)return'Recent'; const d=ts.toDate?ts.toDate():new Date(ts); return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); };
    const timeAgo = ts => { if(!ts)return'Just now'; const d=ts.toDate?ts.toDate():new Date(ts),diff=Date.now()-d,m=Math.floor(diff/60000),h=Math.floor(diff/3600000),dy=Math.floor(diff/86400000); if(m<1)return'Just now'; if(m<60)return m+'m ago'; if(h<24)return h+'h ago'; return dy+'d ago'; };

    function hideLoader() {
        const l = document.getElementById('portalLoader');
        if (l) { l.classList.add('fade-out'); setTimeout(()=>l.remove(), 450); }
    }

    // ══════════════════════════════════════════════════════
    // AUTH GUARD
    // ══════════════════════════════════════════════════════
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            sessionStorage.clear();
            window.location.href = '../auth/login.html';
            return;
        }
        const role = sessionStorage.getItem('userRole');
        if (role && role !== 'individualStudent') {
            sessionStorage.clear();
            window.location.href = '../auth/login.html';
            return;
        }
        hideLoader();
        initPortal(user);
    });

    // ══════════════════════════════════════════════════════
    // PORTAL INIT
    // ══════════════════════════════════════════════════════
    function initPortal(user) {

        // ── resolveStudentDocId ────────────────────────────────────────
        // The Firestore doc ID stored in personalResources.studentId is the
        // individualStudents document ID — NOT the Firebase Auth UID.
        // login.html stores it as 'studentDocId' in sessionStorage.
        //
        // This function returns the correct doc ID via three fallback paths:
        //   1. Fast path: sessionStorage has studentDocId (set by login.html)
        //   2. Heal path: query individualStudents by firebaseUid == user.uid
        //   3. Last resort: use user.uid (will return no resources but won't crash)
        // ─────────────────────────────────────────────────────────────────
        async function resolveStudentDocId() {
            // Fast path
            const cached = sessionStorage.getItem('studentDocId');
            if (cached) return cached;

            // Heal path — look up by firebaseUid
            try {
                const snap = await getDocs(query(
                    collection(db, 'individualStudents'),
                    where('firebaseUid', '==', user.uid)
                ));
                if (!snap.empty) {
                    const d    = snap.docs[0];
                    const data = d.data();
                    // Repair the full session so subsequent loads are fast
                    sessionStorage.setItem('studentDocId',    d.id);
                    sessionStorage.setItem('userId',          user.uid);
                    sessionStorage.setItem('userRole',        'individualStudent');
                    sessionStorage.setItem('userName',        data.fullName || data.username || 'Student');
                    sessionStorage.setItem('studentUsername', data.username || '');
                    console.log('[JDH] Session repaired via firebaseUid lookup. docId:', d.id);
                    return d.id;
                }
            } catch(e) {
                console.warn('[JDH] resolveStudentDocId lookup failed:', e.message);
            }

            // Last resort — resources will be empty but portal loads
            console.warn('[JDH] Could not resolve studentDocId — student may not have firebaseUid set yet. Run Update Code in admin.');
            return user.uid;
        }

        // Boot: resolve docId first, then render everything
        resolveStudentDocId().then(studentId => {
            const studentName = sessionStorage.getItem('userName') || user.displayName || 'Student';

            const initials = getInitials(studentName);
            document.getElementById('userName').textContent          = studentName;
            document.getElementById('topbarStudentName').textContent = studentName;
            document.getElementById('userAvatar').textContent        = initials;
            document.getElementById('sidebarAvatar').textContent     = initials;
            document.getElementById('welcomeMessage').textContent    =
                `Welcome back, ${studentName.split(' ')[0]} — ${new Date().toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'short',year:'numeric'})}`;

            document.getElementById('sidebarLogoutBtn').addEventListener('click', async () => {
                await signOut(auth);
                sessionStorage.clear();
                window.location.href = '../auth/login.html';
            });
            window.logout = function() {
                signOut(auth).catch(e=>console.error(e)).finally(()=>{
                    sessionStorage.clear();
                    window.location.href = '../auth/login.html';
                });
            };

            const fmtCard = item => `
                <div class="resource-card">
                    <div class="resource-type">${item._icon} ${item._type}</div>
                    <div class="resource-name">${item.title}</div>
                    <div class="resource-meta">${fmtDate(item.timestamp)}</div>
                    ${item.description?`<div class="resource-desc">${item.description}</div>`:''}
                    <button class="${item._btn}" onclick="window.open('${item._url}','_blank')">${item._label}</button>
                </div>`;

            let allResources = [], allLinks = [];

            // ── Load personal resources ──────────────────────────────────
            // Queries by studentId == studentDocId (the Firestore doc ID,
            // not the Firebase Auth UID)
            async function loadPersonalResources() {
                const allGrid    = document.getElementById('allResourcesGrid');
                const recentList = document.getElementById('recentResourcesList');
                try {
                    const qs = await getDocs(query(
                        collection(db,'personalResources'),
                        where('studentId','==',studentId)
                    ));
                    allResources = [];
                    qs.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    allResources.sort((a,b)=>(b.timestamp?.toDate()||new Date(0))-(a.timestamp?.toDate()||new Date(0)));
                    const c = allResources.length;
                    document.getElementById('statResources').textContent = c;
                    document.getElementById('resourceCount').textContent  = c;
                    if (!c) {
                        allGrid.innerHTML    = '<div class="empty" style="grid-column:1/-1;">No resources assigned yet.<br>Your instructor will add materials here.</div>';
                        recentList.innerHTML = '<div class="empty">No resources yet</div>';
                        buildActivity();
      loadStudentConversations(); return;
                    }
                    allGrid.innerHTML = allResources.map(fmtCard).join('');
                    recentList.innerHTML = allResources.slice(0,5).map(item=>`
                        <div class="activity-item">
                            <div class="activity-dot-indicator green"></div>
                            <div class="activity-text"><div class="activity-title">${item.title}</div><div class="activity-time">${fmtDate(item.timestamp)}</div></div>
                            <span class="pill pill-active">File</span>
                        </div>`).join('');
                    buildActivity();
                } catch(e) {
                    console.error('Resources error:',e);
                    allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Error loading resources</div>';
                }
            }

            // ── Load personal links ──────────────────────────────────────
            async function loadPersonalLinks() {
                const allGrid    = document.getElementById('allLinksGrid');
                const recentList = document.getElementById('recentLinksList');
                try {
                    const qs = await getDocs(query(
                        collection(db,'personalLinks'),
                        where('studentId','==',studentId)
                    ));
                    allLinks = [];
                    qs.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link',_btn:'open-btn',_url:data.url,_label:'↗ Open Link'}); });
                    allLinks.sort((a,b)=>(b.timestamp?.toDate()||new Date(0))-(a.timestamp?.toDate()||new Date(0)));
                    const c = allLinks.length;
                    document.getElementById('statLinks').textContent = c;
                    document.getElementById('linkCount').textContent  = c;
                    if (!c) {
                        allGrid.innerHTML    = '<div class="empty" style="grid-column:1/-1;">No links shared yet.<br>Your instructor will add links here.</div>';
                        recentList.innerHTML = '<div class="empty">No links yet</div>';
                        buildActivity(); return;
                    }
                    allGrid.innerHTML = allLinks.map(fmtCard).join('');
                    recentList.innerHTML = allLinks.slice(0,5).map(item=>`
                        <div class="activity-item">
                            <div class="activity-dot-indicator gold"></div>
                            <div class="activity-text"><div class="activity-title">${item.title}</div><div class="activity-time">${fmtDate(item.timestamp)}</div></div>
                            <span class="pill pill-gold">Link</span>
                        </div>`).join('');
                    buildActivity();
                } catch(e) {
                    console.error('Links error:',e);
                    allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Error loading links</div>';
                }
            }

            function buildActivity() {
                const log = document.getElementById('activityLog');
                const combined = [
                    ...allResources.map(r=>({title:r.title,time:r.timestamp?.toDate()||new Date(),dot:'green',pill:'pill-active',label:'File'})),
                    ...allLinks.map(l=>({title:l.title,time:l.timestamp?.toDate()||new Date(),dot:'gold',pill:'pill-gold',label:'Link'}))
                ].sort((a,b)=>b.time-a.time);
                if (!combined.length) { log.innerHTML='<div class="empty">No activity yet.</div>'; return; }
                log.innerHTML = combined.map(i=>`
                    <div class="activity-item">
                        <div class="activity-dot-indicator ${i.dot}"></div>
                        <div class="activity-text"><div class="activity-title">${i.title}</div><div class="activity-time">${timeAgo(i.time)} · ${i.label==='File'?'File added':'Link shared'}</div></div>
                        <span class="pill ${i.pill}"></span>
                    </div>`).join('');
            }

            let lastUnread = 0;
            async function loadNotifications() {
                const list = document.getElementById('notifList');
                try {
                    const [sa,ss,sp] = await Promise.all([
                        getDocs(query(collection(db,'notifications'),where('recipientId','==','all'))),
                        getDocs(query(collection(db,'notifications'),where('recipientId','==','all_students'))),
                        getDocs(query(collection(db,'notifications'),where('recipientId','==',studentId)))
                    ]);
                    const all = new Map();
                    [sa,ss,sp].forEach(snap=>snap.docs.forEach(d=>all.set(d.id,{id:d.id,...d.data()})));
                    const notifs = [...all.values()].sort((a,b)=>(b.timestamp?.toDate()||new Date(0))-(a.timestamp?.toDate()||new Date(0)));
                    if (!notifs.length) { list.innerHTML='<div class="empty">No notifications yet</div>'; return; }
                    let unread = 0;
                    list.innerHTML = notifs.map(n=>{
                        if(!n.read)unread++;
                        return `<div class="notif-item ${n.read?'':'unread'}" data-nid="${n.id}">
                            <div class="notif-msg"><strong>${n.title}</strong><br>${n.message}</div>
                            <div class="notif-time">${timeAgo(n.timestamp)}</div>
                        </div>`;
                    }).join('');
                    list.querySelectorAll('.notif-item').forEach(el=>el.addEventListener('click',async()=>{
                        try{await updateDoc(doc(db,'notifications',el.dataset.nid),{read:true});loadNotifications();}catch(e){}
                    }));
                    const badge = document.getElementById('notifBadge');
                    if (unread>0){badge.textContent=unread;badge.style.display='grid';}
                    else{badge.style.display='none';}
                    if (unread>lastUnread&&lastUnread>0) {
                        try{const ctx=new(window.AudioContext||window.webkitAudioContext)(),osc=ctx.createOscillator(),g=ctx.createGain();osc.connect(g);g.connect(ctx.destination);osc.frequency.value=800;osc.type='sine';g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.5);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.5);}catch(e){}
                    }
                    lastUnread = unread;
                } catch(e) {
                    console.error('Notifications error:',e);
                    list.innerHTML='<div class="empty">Error loading notifications</div>';
                }
            }

            async function requestNotifPermission() {
                if(!('Notification' in window)||Notification.permission!=='default')return;
                if(confirm('🔔 Enable desktop notifications?')){
                    const p=await Notification.requestPermission();
                    if(p==='granted')new Notification('🔔 Notifications Enabled',{body:"You'll receive updates from Jaystarbliss Dynamic Hub"});
                }
            }

            console.log('🚀 Student Portal v3 | student:', studentName, '| docId:', studentId, '| uid:', user.uid);
            loadPersonalResources();
            loadPersonalLinks();
            loadNotifications();
            setTimeout(requestNotifPermission, 2000);
            setInterval(loadNotifications, 30000);
        });
    }
