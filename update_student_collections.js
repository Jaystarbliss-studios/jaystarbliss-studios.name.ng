const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

const regexLoadPersonalResources = /async function loadPersonalResources\(\) \{[\s\S]*?loadPersonalLinks\(\);/;

const replacement = `async function fetchStudentSchoolId() {
                try {
                    const docSnap = await require('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').getDoc(doc(db, 'students', studentId));
                    if (docSnap.exists()) return docSnap.data().schoolId || null;
                } catch(e) {}
                return null;
            }

            async function loadPersonalResources() {
                const allGrid    = document.getElementById('allResourcesGrid');
                const recentList = document.getElementById('recentResourcesList');
                try {
                    allResources = [];
                    // 1. Personal Resources
                    const qsPersonal = await getDocs(query(collection(db,'personalResources'), where('studentId','==',studentId)));
                    qsPersonal.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File (Personal)',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    
                    // 2. General Resources
                    const qsGeneral = await getDocs(query(collection(db,'resources')));
                    qsGeneral.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File (General)',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    
                    // 3. School Resources
                    const docRef = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(m => m.getDoc(doc(db, 'students', studentId)));
                    const schoolId = docRef.exists() ? docRef.data().schoolId : null;
                    if (schoolId) {
                        const qsSchool = await getDocs(query(collection(db,'schoolResources'), where('schoolId','==',schoolId)));
                        qsSchool.forEach(d => { const data=d.data(); allResources.push({id:d.id,...data,_icon:'📄',_type:'File (School)',_btn:'download-btn',_url:data.fileUrl,_label:'↓ Download'}); });
                    }
                    
                    allResources.sort((a,b)=>(b.timestamp?.toDate()||new Date(0))-(a.timestamp?.toDate()||new Date(0)));
                    
                    const c = allResources.length;
                    const tmp_statResources = document.getElementById('statResources'); if(tmp_statResources) tmp_statResources.textContent = c;
                    const tmp_resourceCount = document.getElementById('resourceCount'); if(tmp_resourceCount) tmp_resourceCount.textContent = c;
                    
                    if (!c) {
                        allGrid.innerHTML    = '<div class="empty" style="grid-column:1/-1;">No resources assigned yet.<br>Your instructor will add materials here.</div>';
                        recentList.innerHTML = '<div class="empty">No resources yet</div>';
                        buildActivity();      loadStudentConversations(); return;
                    }
                    
                    allGrid.innerHTML = allResources.map(fmtCard).join('');
                    recentList.innerHTML = allResources.slice(0,5).map(item=>\`
                        <div class="activity-item">
                            <div class="activity-dot-indicator green"></div>
                            <div class="activity-text"><div class="activity-title">\${item.title}</div><div class="activity-time">\${fmtDate(item.timestamp)}</div></div>
                        </div>\`).join('');
                    
                    buildActivity();
                    loadStudentConversations();
                } catch(e) {
                    console.error('[JDH] Error loadPersonalResources', e);
                    allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Error loading resources.</div>';
                }
            }

            async function loadPersonalLinks() {
                const allGrid = document.getElementById('allLinksGrid');
                try {
                    allLinks = [];
                    // 1. Personal Links
                    const qsPersonal = await getDocs(query(collection(db,'personalLinks'), where('studentId','==',studentId)));
                    qsPersonal.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link (Personal)',_btn:'link-btn',_url:data.url,_label:'Go to Link →'}); });
                    
                    // 2. General Links
                    const qsGeneral = await getDocs(query(collection(db,'links')));
                    qsGeneral.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link (General)',_btn:'link-btn',_url:data.url,_label:'Go to Link →'}); });
                    
                    // 3. School Links
                    const docRef = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(m => m.getDoc(doc(db, 'students', studentId)));
                    const schoolId = docRef.exists() ? docRef.data().schoolId : null;
                    if (schoolId) {
                        const qsSchool = await getDocs(query(collection(db,'schoolLinks'), where('schoolId','==',schoolId)));
                        qsSchool.forEach(d => { const data=d.data(); allLinks.push({id:d.id,...data,_icon:'🔗',_type:'Link (School)',_btn:'link-btn',_url:data.url,_label:'Go to Link →'}); });
                    }

                    allLinks.sort((a,b)=>(b.timestamp?.toDate()||new Date(0))-(a.timestamp?.toDate()||new Date(0)));
                    
                    const c = allLinks.length;
                    const tmp_linkCount = document.getElementById('linkCount'); if(tmp_linkCount) tmp_linkCount.textContent = c;
                    
                    if (!c) {
                        allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">No links assigned yet.</div>';
                        return;
                    }
                    allGrid.innerHTML = allLinks.map(fmtCard).join('');
                } catch(e) {
                    console.error('[JDH] Error loadPersonalLinks', e);
                    allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Error loading links.</div>';
                }
            }

            // Note: exams logic would be needed but there is no exam tab in student-portal.html

`;

html = html.replace(/async function loadPersonalResources\(\) \{[\s\S]*?\} catch\(e\) \{[\s\S]*?\}[\s\S]*?\}/, replacement);
// We need a better regex. Let's do it manually.
