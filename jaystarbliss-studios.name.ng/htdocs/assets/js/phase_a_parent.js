import { getFirestore, doc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export function loadParentProgress(db, studentId) {
    const container = document.getElementById('progressContainer');
    if(!container) return;
    
    onSnapshot(doc(db, 'progress', studentId), (snap) => {
        if(!snap.exists()) {
            container.innerHTML = '<div class="req-empty">No progress data available yet.</div>';
            return;
        }
        const data = snap.data();
        
        let html = `<div style="display:flex; gap:16px; margin-bottom: 24px; flex-wrap:wrap;">
            <div class="metric-card" style="flex:1; min-width:150px;">
                <div class="metric-label">Performance</div>
                <div class="metric-value">${data.performanceScore || 0}%</div>
            </div>
            <div class="metric-card" style="flex:1; min-width:150px;">
                <div class="metric-label">Completion</div>
                <div class="metric-value">${data.completionPercentage || 0}%</div>
            </div>
        </div>`;
        
        if (data.programmeApprovedByAdmin) {
            html += `
            <h3 style="margin-bottom:8px; color:var(--brand-primary); font-family:'Poppins', sans-serif;">${data.programmeTitle || 'Programme'}</h3>
            <p style="margin-bottom:16px; color:var(--text-secondary);">${data.programmeOutline}</p>
            <h4 style="margin-bottom:8px;">Objectives</h4>
            <ul style="margin-bottom:24px; list-style:disc; padding-left:20px;">
                ${(data.programmeObjectives || []).map(obj => `<li>${obj}</li>`).join('')}
            </ul>
            `;
        } else {
            html += `<div class="info-box">Programme outline is being reviewed. It will appear here once approved.</div>`;
        }
        
        html += `
        <h4 style="margin-bottom:8px;">Checklist</h4>
        <div style="margin-bottom:24px;">
            ${(data.checklistItems || []).map(item => `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <span class="material-symbols-outlined" style="color:${item.completed ? '#1D9E75' : '#ccc'}">
                        ${item.completed ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span style="color:${item.completed ? 'var(--text-primary)' : 'var(--text-muted)'}">${item.label}</span>
                </div>
            `).join('') || '<span style="color:var(--text-muted)">No items</span>'}
        </div>
        `;
        
        // Add canvas for chart
        html += `<h4 style="margin-bottom:8px;">Performance Over Time</h4>
        <div style="height:250px; position:relative;">
            <canvas id="performanceChart"></canvas>
        </div>`;
        
        container.innerHTML = html;
        
        // Render chart
        if (data.sessionHistory && data.sessionHistory.length >= 2) {
            renderChart(data.sessionHistory);
        } else {
            const canvasContainer = document.getElementById('performanceChart').parentNode;
            canvasContainer.innerHTML = '<div class="req-empty">Charts will appear after 2 sessions have been logged.</div>';
        }
    });
}

function renderChart(history) {
    if(!window.Chart) return;
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const labels = history.map(h => {
        const d = h.date?.toDate();
        return d ? d.toLocaleDateString() : '';
    });
    const data = history.map(h => h.score);
    
    new window.Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Score',
                data,
                borderColor: '#2C2C59',
                backgroundColor: 'rgba(201,168,76,0.3)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: 100 } }
        }
    });
}


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
            
            html += `<div style="border:1px solid var(--outline-variant); border-radius:8px; padding:15px; background:var(--surface);">
                <div style="font-weight:bold; margin-bottom:5px;">W${s.weekNumber} - Session ${s.sessionNumber}</div>
                <div style="font-size:14px; color:var(--text-secondary); margin-bottom:10px;">${start.toLocaleString()}</div>
                <div>${statusBadge}</div>
            </div>`;
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
                    countdown.innerText = `${days}d ${hours}h ${mins}m ${secs}s`;
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
