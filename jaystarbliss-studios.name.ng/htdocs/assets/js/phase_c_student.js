import { getFirestore, collection, getDocs, query, orderBy, limit, doc, updateDoc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function initPhaseCStudent(db, studentId) {
    loadLeaderboard(db);
    loadQuizzes(db, studentId);
    updateCoinDisplay(db, studentId);
}

async function updateCoinDisplay(db, studentId) {
    try {
        const snap = await getDoc(doc(db, 'students', studentId));
        if(snap.exists()) {
            const data = snap.data();
            const coins = data.gamification?.coins || 0;
            const pts = data.gamification?.points || 0;
            const header = document.querySelectorAll('header .flex.items-center.gap-md')[1];
            if(header && !document.getElementById('coinDisplay')) {
                const coinHtml = `<div id="coinDisplay" style="display:flex; align-items:center; gap:5px; background:var(--brand-secondary-light); padding:5px 10px; border-radius:20px; font-weight:bold; color:var(--brand-primary);">
                    <span class="material-symbols-outlined" style="color:#C9A84C;">toll</span>
                    <span id="coinVal">${coins}</span> Coins
                </div>`;
                header.insertAdjacentHTML('afterbegin', coinHtml);
            } else if(document.getElementById('coinVal')) {
                document.getElementById('coinVal').innerText = coins;
            }
        }
    } catch(e) {
        console.error(e);
    }
}

async function loadLeaderboard(db) {
    const container = document.getElementById('leaderboardContainer');
    if(!container) return;
    try {
        const q = query(collection(db, 'students'), orderBy('gamification.points', 'desc'), limit(10));
        const snap = await getDocs(q);
        let html = '<table style="width:100%; border-collapse:collapse;">';
        html += '<tr style="border-bottom:2px solid #eee;"><th>Rank</th><th>Student</th><th>Points</th><th>Badges</th></tr>';
        
        let rank = 1;
        snap.forEach(d => {
            const data = d.data();
            const pts = data.gamification?.points || 0;
            if(pts > 0) {
                const badges = (data.gamification?.badges || []).length;
                html += `<tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px;">#${rank}</td>
                    <td style="padding:10px; font-weight:bold;">${data.name || data.fullName || 'Unknown'}</td>
                    <td style="padding:10px; color:var(--brand-primary);">${pts}</td>
                    <td style="padding:10px;">${badges}</td>
                </tr>`;
                rank++;
            }
        });
        html += '</table>';
        if(rank === 1) html = '<div class="req-empty">No scores yet.</div>';
        
        container.innerHTML = html;
    } catch(e) {
        console.error(e);
        container.innerHTML = 'Error loading leaderboard. Note: Requires index on gamification.points descending.';
    }
}

async function loadQuizzes(db, studentId) {
    const container = document.getElementById('quizzesContainer');
    if(!container) return;
    try {
        const snap = await getDocs(collection(db, 'quizzes'));
        const completedSnap = await getDocs(collection(db, 'students', studentId, 'completedQuizzes'));
        const completedIds = new Set();
        completedSnap.forEach(d => completedIds.add(d.id));
        
        let html = '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">';
        let found = false;
        snap.forEach(d => {
            found = true;
            const data = d.data();
            const isCompleted = completedIds.has(d.id);
            html += `<div style="border:1px solid #eee; padding:15px; border-radius:8px; background:white;">
                <h4 style="margin-top:0;">${data.title}</h4>
                <p style="font-size:12px; color:#666;">${data.description}</p>
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; color:#C9A84C;">+${data.rewardCoins} Coins</span>
                    ${isCompleted ? 
                        '<span style="color:green; font-weight:bold;">Completed</span>' : 
                        `<button onclick="window.startQuiz('${d.id}')" style="background:var(--brand-primary); color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Start</button>`
                    }
                </div>
            </div>`;
        });
        html += '</div>';
        if(!found) html = '<div class="req-empty">No quizzes available right now.</div>';
        container.innerHTML = html;
    } catch(e) {
        console.error(e);
        container.innerHTML = 'Error loading quizzes.';
    }
}

window.startQuiz = async function(quizId) {
    const db = getFirestore();
    const myUid = localStorage.getItem('userId');
    try {
        const snap = await getDoc(doc(db, 'quizzes', quizId));
        if(!snap.exists()) return alert("Quiz not found");
        const data = snap.data();
        
        // Simple prompt based quiz for demo
        let score = 0;
        for(let i=0; i<data.questions.length; i++) {
            const q = data.questions[i];
            let ans = prompt(q.text + "\\nOptions: " + q.options.join(", "));
            if(ans && ans.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
                score++;
            }
        }
        
        alert(`You got ${score} out of ${data.questions.length} correct!`);
        
        if(score === data.questions.length) {
            // Give reward
            await setDoc(doc(db, 'students', myUid, 'completedQuizzes', quizId), {
                completedAt: serverTimestamp(),
                score: score
            });
            
            // update student coins
            const studRef = doc(db, 'students', myUid);
            const studSnap = await getDoc(studRef);
            let coins = studSnap.data().gamification?.coins || 0;
            let points = studSnap.data().gamification?.points || 0;
            
            await updateDoc(studRef, {
                'gamification.coins': coins + (data.rewardCoins || 50),
                'gamification.points': points + (data.rewardCoins || 50) * 10
            });
            alert("Reward added!");
            
            initPhaseCStudent(db, myUid);
        } else {
            alert("You need a perfect score to earn the reward. Try again!");
        }
    } catch(e) {
        alert("Error: " + e.message);
    }
};
