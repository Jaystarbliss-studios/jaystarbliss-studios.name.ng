const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_a_parent.js', 'utf8');

if(!code.includes('loadParentCalendar')) {
    const calendarLogic = `
export async function loadParentCalendar(db, studentId) {
    const container = document.getElementById('calendarContainer');
    const countdown = document.getElementById('countdownText');
    if(!container) return;
    
    const { query, collection, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    try {
        const q = query(collection(db, 'sessions'), where('studentId', '==', studentId));
        const snap = await getDocs(q);
        let sessions = [];
        snap.forEach(d => sessions.push({id: d.id, ...d.data()}));
        sessions.sort((a,b) => (a.startTime?.toMillis()||0) - (b.startTime?.toMillis()||0));
        
        if(sessions.length === 0) {
            container.innerHTML = '<div class="req-empty" style="grid-column:1/-1;">No sessions scheduled for this student.</div>';
            countdown.innerText = 'No upcoming class';
            if(window.timerInterval) clearInterval(window.timerInterval);
            return;
        }
        
        let html = '';
        let nextSession = null;
        const now = new Date();
        
        sessions.forEach(s => {
            const start = s.startTime?.toDate();
            if(!start) return;
            
            if(!nextSession && start > now && s.status === 'scheduled') {
                nextSession = start;
            }
            
            const isPast = start < now;
            let statusBadge = '';
            if(s.attendance?.marked) {
                statusBadge = s.attendance.status === 'present' ? '<span style="color:green">Present</span>' : '<span style="color:red">Absent</span>';
            } else if(isPast) {
                statusBadge = '<span style="color:orange">Pending</span>';
            } else {
                statusBadge = '<span style="color:blue">Upcoming</span>';
            }
            
            html += \`<div style="border:1px solid var(--outline-variant); border-radius:8px; padding:15px; background:var(--surface);">
                <div style="font-weight:bold; margin-bottom:5px;">W\${s.weekNumber} - Session \${s.sessionNumber}</div>
                <div style="font-size:14px; color:var(--text-secondary); margin-bottom:10px;">\${start.toLocaleString()}</div>
                <div>\${statusBadge}</div>
            </div>\`;
        });
        
        container.innerHTML = html;
        
        if(window.timerInterval) clearInterval(window.timerInterval);
        
        if(nextSession) {
            window.timerInterval = setInterval(() => {
                const diff = nextSession.getTime() - new Date().getTime();
                if(diff <= 0) {
                    countdown.innerText = 'Class starting now!';
                    clearInterval(window.timerInterval);
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const secs = Math.floor((diff % (1000 * 60)) / 1000);
                    countdown.innerText = \`\${days}d \${hours}h \${mins}m \${secs}s\`;
                }
            }, 1000);
        } else {
            countdown.innerText = 'No upcoming class';
        }
    } catch(e) {
        console.error(e);
        container.innerHTML = 'Error loading calendar.';
    }
}
`;
    code += '\n' + calendarLogic;
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_a_parent.js', code);
    
    let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');
    html = html.replace(/import \{ loadParentProgress \} from '\.\.\/\.\.\/assets\/js\/phase_a_parent\.js';/, "import { loadParentProgress, loadParentCalendar } from '../../assets/js/phase_a_parent.js';");
    html = html.replace(/loadParentProgress\(db, childId\);/, "loadParentProgress(db, childId);\n    loadParentCalendar(db, childId);");
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', html);
    
    console.log("Updated phase_a_parent.js for Phase B");
}
