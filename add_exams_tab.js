const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

// Add tab to sidebar
const sidebarTarget = `<button class="nav-item " data-tab="links" onclick="window.switchTab('links')">
                    <span class="material-symbols-outlined">link</span> My Links<span class="nav-badge-count" id="linkCount">0</span>
                </button>`;
const newSidebar = sidebarTarget + `\n<button class="nav-item " data-tab="exams" onclick="window.switchTab('exams')">
                    <span class="material-symbols-outlined">quiz</span> My Exams<span class="nav-badge-count" id="examCount">0</span>
                </button>`;
html = html.replace(sidebarTarget, newSidebar);

// Add tab to mobile nav
const mobileTarget = `<button class="mobile-nav-item" data-tab="links" onclick="window.switchTab('links')">
                <span class="material-symbols-outlined">link</span>
                <span>Links</span>
            </button>`;
const newMobile = mobileTarget + `\n<button class="mobile-nav-item" data-tab="exams" onclick="window.switchTab('exams')">
                <span class="material-symbols-outlined">quiz</span>
                <span>Exams</span>
            </button>`;
html = html.replace(mobileTarget, newMobile);

// Add tab-pane
const tabPaneTarget = `<div class="tab-pane" id="tab-links">
        <div class="panel">
            <div class="panel-head"><div class="panel-title"><span class="material-symbols-outlined">link</span> My Links</div></div>
            <div class="panel-body">
                <div class="posts-grid" id="allLinksGrid">
                    <!-- Loaded via JS -->
                </div>
            </div>
        </div>
    </div>`;
const newTabPane = tabPaneTarget + `\n
    <div class="tab-pane" id="tab-exams">
        <div class="panel">
            <div class="panel-head"><div class="panel-title"><span class="material-symbols-outlined">quiz</span> My Exams</div></div>
            <div class="panel-body">
                <div class="posts-grid" id="allExamsGrid">
                    <!-- Loaded via JS -->
                </div>
            </div>
        </div>
    </div>`;
html = html.replace(tabPaneTarget, newTabPane);

// Add JS logic to load exams
const jsTarget = `loadPersonalLinks();`;
const jsReplace = `loadPersonalLinks();
            loadExams();`;

html = html.replace(jsTarget, jsReplace);

// Add loadExams implementation
const fnTarget = `async function loadPersonalLinks() {`;
const fnReplace = `
            let allExams = [];
            async function loadExams() {
                const allGrid = document.getElementById('allExamsGrid');
                try {
                    allExams = [];
                    // General Exams
                    const qsGeneral = await getDocs(collection(db,'exams'));
                    qsGeneral.forEach(d => { const data=d.data(); allExams.push({id:d.id,...data,_icon:'📝',_type:'Exam (General)',_btn:'open-btn',_url:data.url,_label:'Take Exam →'}); });
                    
                    // School Exams
                    if (window._jdh_studentData && window._jdh_studentData.schoolId) {
                        const qsSchool = await getDocs(query(collection(db,'schoolExams'), where('schoolId','==',window._jdh_studentData.schoolId)));
                        qsSchool.forEach(d => { const data=d.data(); allExams.push({id:d.id,...data,_icon:'📝',_type:'Exam (School)',_btn:'open-btn',_url:data.url,_label:'Take Exam →'}); });
                    }

                    allExams.sort((a,b)=>(b.timestamp?.toDate()||new Date(0))-(a.timestamp?.toDate()||new Date(0)));
                    
                    const c = allExams.length;
                    const tmp_examCount = document.getElementById('examCount'); if(tmp_examCount) tmp_examCount.textContent = c;
                    
                    if (!c) {
                        allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">No exams assigned yet.</div>';
                        return;
                    }
                    allGrid.innerHTML = allExams.map(fmtCard).join('');
                } catch(e) {
                    console.error('[JDH] Error loadExams', e);
                    allGrid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Error loading exams.</div>';
                }
            }

            ` + fnTarget;

html = html.replace(fnTarget, fnReplace);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', html);
console.log("Added exams tab to student portal");
