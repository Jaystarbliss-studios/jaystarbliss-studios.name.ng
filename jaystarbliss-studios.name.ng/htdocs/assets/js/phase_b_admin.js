import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, writeBatch, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let allStudents = [];
let allTutors = [];

export async function initPhaseBAdmin(db) {
    loadCycles(db);
    loadDropdowns(db);
}

async function loadDropdowns(db) {
    try {
        const sSnap = await getDocs(collection(db, 'students'));
        allStudents = sSnap.docs.map(d => ({id: d.id, ...d.data()}));
        const tSnap = await getDocs(query(collection(db, 'staff')));
        allTutors = tSnap.docs.map(d => ({id: d.id, ...d.data()})).filter(t => t.role === 'tutor' || t.role === 'Staff'); 
        // Note: some staff might be tutors
    } catch(e) {
        console.error("Error loading dropdowns:", e);
    }
}

export async function loadCycles(db) {
    const tbody = document.querySelector('#cyclesTable tbody');
    if(!tbody) return;
    try {
        const snap = await getDocs(query(collection(db, 'cycles'), orderBy('createdAt', 'desc')));
        let html = '';
        snap.forEach(d => {
            const data = d.data();
            html += `<tr>
                <td>${data.studentId}</td>
                <td>${data.tutorId}</td>
                <td>${data.subject}</td>
                <td>${data.frequency}</td>
                <td>${data.startDate?.toDate().toLocaleDateString() || ''}</td>
                <td>${data.status}</td>
            </tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="6" class="req-empty">No cycles found</td></tr>';
    } catch(e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="6" class="req-empty">Error loading cycles.</td></tr>';
    }
}

window.openCycleModal = function() {
    const sOpts = allStudents.map(s => `<option value="${s.id}">${s.name || s.fullName || s.id}</option>`).join('');
    const tOpts = allTutors.map(t => `<option value="${t.id}">${t.name || t.fullName || t.id}</option>`).join('');
    
    const html = `
    <div id="cycleModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; display:flex; justify-content:center; align-items:center;">
        <div style="background:white; padding:20px; border-radius:8px; width:400px; max-height:90vh; overflow-y:auto; color: black;">
            <h3>Create 4-Week Cycle</h3>
            <div style="margin-bottom:10px;">
                <label>Student</label><br>
                <select id="cStudent" style="width:100%; padding:5px;">${sOpts}</select>
            </div>
            <div style="margin-bottom:10px;">
                <label>Tutor</label><br>
                <select id="cTutor" style="width:100%; padding:5px;">${tOpts}</select>
            </div>
            <div style="margin-bottom:10px;">
                <label>Subject</label><br>
                <input type="text" id="cSubject" style="width:100%; padding:5px;">
            </div>
            <div style="margin-bottom:10px;">
                <label>Frequency (sessions per week)</label><br>
                <select id="cFreq" style="width:100%; padding:5px;">
                    <option value="once_weekly">1 session/week (4 total)</option>
                    <option value="twice_weekly">2 sessions/week (8 total)</option>
                    <option value="three_times_weekly">3 sessions/week (12 total)</option>
                </select>
            </div>
            <div style="margin-bottom:10px;">
                <label>Start Date</label><br>
                <input type="date" id="cStartDate" style="width:100%; padding:5px;">
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                <button onclick="document.getElementById('cycleModal').remove()" style="padding:8px 12px; cursor:pointer;">Cancel</button>
                <button onclick="window.saveCycle()" style="background:#2C2C59; color:white; padding:8px 12px; cursor:pointer;">Create & Generate Sessions</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
};

window.saveCycle = async function() {
    const studentId = document.getElementById('cStudent').value;
    const tutorId = document.getElementById('cTutor').value;
    const subject = document.getElementById('cSubject').value;
    const freq = document.getElementById('cFreq').value;
    const startDateStr = document.getElementById('cStartDate').value;
    
    if(!studentId || !tutorId || !subject || !startDateStr) return alert("Fill all fields");
    
    const sessionsPerWeek = freq === 'once_weekly' ? 1 : freq === 'twice_weekly' ? 2 : 3;
    const totalSessions = sessionsPerWeek * 4;
    const startDate = new Date(startDateStr);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 27); // approx 4 weeks later
    
    try {
        const db = getFirestore();
        // create cycle
        const cycleRef = await addDoc(collection(db, 'cycles'), {
            studentId, tutorId, subject, frequency: freq,
            sessionsPerCycle: totalSessions,
            startDate: startDate,
            endDate: endDate,
            status: 'active',
            createdAt: serverTimestamp()
        });
        
        // create sessions
        const batch = writeBatch(db);
        let currentSessDate = new Date(startDate);
        
        for(let i=1; i<=totalSessions; i++) {
            const sessRef = doc(collection(db, 'sessions'));
            batch.set(sessRef, {
                cycleId: cycleRef.id,
                studentId, tutorId, subject,
                status: 'scheduled',
                frequency: freq,
                weekNumber: Math.ceil(i / sessionsPerWeek),
                sessionNumber: i,
                startTime: new Date(currentSessDate),
                endTime: new Date(currentSessDate.getTime() + 60*60*1000), // + 1 hour
                attendance: { marked: false, status: null, markedAt: null, markedBy: null },
                rescheduleHistory: [],
                tutorNote: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            currentSessDate.setDate(currentSessDate.getDate() + Math.round(7/sessionsPerWeek));
        }
        await batch.commit();
        
        document.getElementById('cycleModal').remove();
        loadCycles(db);
        alert("Cycle and " + totalSessions + " sessions created successfully.");
    } catch(e) {
        alert("Error: " + e.message);
    }
};

window.createQuiz = async function() {
    const title = prompt("Quiz Title (e.g. 'Math Basics')");
    if(!title) return;
    const desc = prompt("Description");
    const q1 = prompt("Question 1 text?");
    if(!q1) return;
    const ans1 = prompt("Correct answer for Q1?");
    
    try {
        const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        await addDoc(collection(getFirestore(), 'quizzes'), {
            title: title,
            description: desc || 'Complete this quiz to earn coins!',
            rewardCoins: 50,
            questions: [
                {
                    text: q1,
                    options: [ans1, "Other Option 1", "Other Option 2"],
                    correctAnswer: ans1
                }
            ],
            createdAt: serverTimestamp()
        });
        alert("Quiz created!");
    } catch(e) {
        alert(e);
    }
};
