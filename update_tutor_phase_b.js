const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_a_tutor.js', 'utf8');

if(!code.includes('Attendance & Sessions')) {
    code = code.replace(/<hr>\s*<h3>Programme Setup<\/h3>/, `
            <hr>
            <h3>Attendance & Sessions</h3>
            <div id="sessionsContainer" style="margin-bottom:15px;">Loading sessions...</div>
            <hr>
            <h3>Programme Setup</h3>
    `);
    
    // Add logic to load sessions
    const sessionLogic = `
window.loadStudentSessions = async function(studentId) {
    const db = getFirestore();
    const myUid = localStorage.getItem('userId');
    const { query, collection, where, getDocs, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    try {
        const q = query(collection(db, 'sessions'), 
            where('studentId', '==', studentId),
            where('tutorId', '==', myUid)
            // orderBy needs composite index, let's just sort client side
        );
        const snap = await getDocs(q);
        let sessions = [];
        snap.forEach(d => sessions.push({id: d.id, ...d.data()}));
        sessions.sort((a,b) => (a.startTime?.toMillis()||0) - (b.startTime?.toMillis()||0));
        
        let html = '';
        if(sessions.length === 0) {
            html = 'No scheduled sessions found.';
        } else {
            sessions.forEach(s => {
                const dateStr = s.startTime?.toDate().toLocaleDateString() || '';
                const marked = s.attendance?.marked;
                html += \`<div style="border:1px solid #eee; padding:10px; margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>W\${s.weekNumber} S\${s.sessionNumber}</strong> - \${dateStr}<br>
                        <span style="font-size:12px; color:\${marked ? 'green' : 'orange'}">\${marked ? 'Attendance Marked (' + s.attendance.status + ')' : 'Pending'}</span>
                    </div>
                    <div>
                        \${!marked ? \`
                        <button onclick="window.markAttendance('\${s.id}', 'present')" style="background:green; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Present</button>
                        <button onclick="window.markAttendance('\${s.id}', 'absent')" style="background:red; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Absent</button>
                        \` : \`<button onclick="window.markAttendance('\${s.id}', 'present')" style="background:#eee; border:none; padding:4px; cursor:pointer;">Edit</button>\`}
                    </div>
                </div>\`;
            });
        }
        document.getElementById('sessionsContainer').innerHTML = html;
    } catch(e) {
        console.error(e);
        document.getElementById('sessionsContainer').innerHTML = 'Error loading sessions.';
    }
};

window.markAttendance = async function(sessionId, status) {
    const db = getFirestore();
    const myUid = localStorage.getItem('userId');
    try {
        await updateDoc(doc(db, 'sessions', sessionId), {
            'attendance.marked': true,
            'attendance.status': status,
            'attendance.markedAt': serverTimestamp(),
            'attendance.markedBy': myUid,
            status: 'completed'
        });
        // We need studentId to reload... let's just get it from currentStudentData if possible, 
        // wait we can just re-call viewStudentDetails but we need studentId. 
        // studentId is passed to toggleChecklist but not here.
        // Let's store it globally.
        window.loadStudentSessions(window.currentViewStudentId);
    } catch(e) {
        alert("Error: " + e.message);
    }
};
    `;
    
    code = code.replace(/window\.viewStudentDetails\s*=\s*async function\(studentId\) \{/, `
window.currentViewStudentId = null;
window.viewStudentDetails = async function(studentId) {
    window.currentViewStudentId = studentId;
`);

    code += '\n' + sessionLogic;
    
    // Call loadStudentSessions inside viewStudentDetails
    code = code.replace(/container\.style\.display = 'block';/, `
        container.style.display = 'block';
        window.loadStudentSessions(studentId);
    `);
    
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_a_tutor.js', code);
    console.log("Updated phase_a_tutor.js with Phase B logic.");
}
